import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, cancelOrder } from '../api/orderApi';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  Calendar,
  DollarSign,
  ShoppingBag,
  Mail,
  Phone,
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');

  useEffect(() => {
    console.log(' ORDERS PAGE - MES COMMANDES (ACHETEUR) ');
    console.log('Token présent:', !!token);

    if (!token) {
      console.warn(' Pas de token - Redirection vers login');
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log(' Récupération de MES commandes (je suis l\'acheteur)...');

      const data = await getOrders();
      console.log(' MES commandes récupérées:', data);

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(' Erreur fetchOrders:', error);
      showNotification('Erreur lors du chargement de vos commandes', 'error');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      console.log(' Déconnexion de l\'utilisateur');
      localStorage.clear();
      navigate('/login');
    }
  };

  const showNotification = (message, type = 'success') => {
    console.log(` Notification [${type}]:`, message);
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      console.log(' Annulation de la commande:', orderId);

      await cancelOrder(orderId);
      showNotification('Commande annulée avec succès', 'success');
      await fetchOrders();
    } catch (error) {
      console.error(' Erreur lors de l\'annulation:', error);
      const errorMsg = error.response?.data?.message || 'Erreur lors de l\'annulation';
      showNotification(errorMsg, 'error');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusStyle = (status) => {
    const statusStyles = {
      Pending: { background: '#fef3c7', color: '#92400e', icon: Clock },
      Processing: { background: '#dbeafe', color: '#1e40af', icon: Package },
      Shipped: { background: '#e0e7ff', color: '#4338ca', icon: Package },
      Delivered: { background: '#d1fae5', color: '#065f46', icon: CheckCircle },
      Cancelled: { background: '#fee2e2', color: '#8b0000', icon: XCircle },
    };
    return statusStyles[status] || statusStyles.Pending;
  };

  const getStatusText = (status) => {
    const statusMap = {
      Pending: 'En attente',
      Processing: 'En traitement',
      Shipped: 'Expédiée',
      Delivered: 'Livrée',
      Cancelled: 'Annulée',
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getItemTotalPrice = (item) => {
    return item.price * item.quantity;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Loader style={styles.spinner} size={48} />
        <p style={styles.loadingText}>Chargement de vos commandes...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
        `}
      </style>

      <Navbar
        userName={userName}
        onLogout={handleLogout}
      />

      {notification.show && (
        <div
          style={{
            ...styles.notification,
            ...(notification.type === 'success' ? styles.notificationSuccess : styles.notificationError),
          }}
        >
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{notification.message}</span>
        </div>
      )}

      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <h2 style={styles.headerTitle}>
              <ShoppingBag size={32} />
              Mes Commandes
            </h2>
            <p style={styles.headerSubtitle}>
              Suivez l'état de vos commandes en temps réel
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div style={styles.emptyOrders}>
            <div style={styles.emptyIcon}>
              <Package size={80} color="#8b0000" />
            </div>
            <h3 style={styles.emptyTitle}>Aucune commande</h3>
            <p style={styles.emptyText}>Vous n'avez pas encore passé de commande</p>
            <button style={styles.shopButton} onClick={() => navigate('/products')}>
              <ShoppingBag size={20} />
              Découvrir nos produits
            </button>
          </div>
        ) : (
          <div style={styles.ordersGrid}>
            {orders.map((order) => {
              const statusStyle = getStatusStyle(order.status);
              const StatusIcon = statusStyle.icon;

              return (
                <div key={order.id} style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <div style={styles.orderHeaderLeft}>
                      <h3 style={styles.orderId}>Commande #{order.id}</h3>
                      <div style={styles.orderDate}>
                        <Calendar size={16} color="#666" />
                        {formatDate(order.orderDate)}
                      </div>
                    </div>
                    <div
                      style={{
                        ...styles.statusBadge,
                        background: statusStyle.background,
                        color: statusStyle.color,
                      }}
                    >
                      <StatusIcon size={18} />
                      {getStatusText(order.status)}
                    </div>
                  </div>

                  {(order.email || order.phone) && (
                    <div style={styles.contactInfo}>
                      <h4 style={styles.contactTitle}>Informations de contact</h4>
                      <div style={styles.contactDetails}>
                        {order.email && (
                          <div style={styles.contactItem}>
                            <Mail size={16} color="#8b0000" />
                            <span>{order.email}</span>
                          </div>
                        )}
                        {order.phone && (
                          <div style={styles.contactItem}>
                            <Phone size={16} color="#8b0000" />
                            <span>{order.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div style={styles.orderItems}>
                    {order.items?.map((item) => {
                      const totalPrice = getItemTotalPrice(item);

                      return (
                        <div key={item.id} style={styles.orderItem}>
                          <div style={styles.itemImageContainer}>
                            {item.product?.imageUrl ? (
                              <img
                                src={`http://localhost:5017${item.product.imageUrl}`}
                                alt={item.product.name || item.productName}
                                style={styles.itemImage}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div style={{ ...styles.noImage, display: item.product?.imageUrl ? 'none' : 'flex' }}>
                              <Package size={28} color="#8b0000" />
                            </div>
                          </div>

                          <div style={styles.itemInfo}>
                            <h4 style={styles.itemName}>
                              {item.product?.name || item.productName || 'Produit'}
                            </h4>
                            <p style={styles.itemQuantity}>
                              Quantité: {item.quantity} × {item.price?.toFixed(2) || '0.00'} DH
                            </p>
                          </div>

                          <div style={styles.itemPrice}>
                            <DollarSign size={18} color="#8b0000" />
                            <span>{totalPrice.toFixed(2)} DH</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={styles.orderFooter}>
                    <div style={styles.orderTotal}>
                      <span style={styles.totalLabel}>Total de la commande</span>
                      <span style={styles.totalAmount}>
                        {order.totalAmount?.toFixed(2) || '0.00'} DH
                      </span>
                    </div>

                    {order.status === 'Pending' && (
                      <button
                        style={{
                          ...styles.cancelButton,
                          ...(cancellingOrderId === order.id && styles.cancelButtonDisabled),
                        }}
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrderId === order.id}
                      >
                        {cancellingOrderId === order.id ? (
                          <>
                            <Loader style={styles.spinner} size={16} />
                            Annulation...
                          </>
                        ) : (
                          <>
                            <XCircle size={18} />
                            Annuler la commande
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  header: {
    marginBottom: '40px',
    animation: 'fadeIn 0.5s ease',
  },
  headerContent: {
    textAlign: 'center',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    fontSize: '36px',
    color: 'white',
    margin: '0 0 12px 0',
    fontWeight: '800',
    letterSpacing: '-1px',
  },
  headerSubtitle: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: 0,
    fontWeight: '500',
  },
  emptyOrders: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    gap: '24px',
    animation: 'fadeIn 0.5s ease',
  },
  emptyIcon: {
    width: '120px',
    height: '120px',
    background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(139, 0, 0, 0.2)',
  },
  emptyTitle: {
    fontSize: '28px',
    color: '#1a1a2e',
    margin: 0,
    fontWeight: '800',
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
    fontWeight: '500',
  },
  shopButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #8b0000, #6d0000)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(139, 0, 0, 0.3)',
  },
  ordersGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  orderCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'fadeIn 0.5s ease',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '2px solid #f0f0f0',
  },
  orderHeaderLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  orderId: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#1a1a2e',
    margin: 0,
  },
  orderDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '24px',
    fontSize: '14px',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  contactInfo: {
    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '2px solid #e5e7eb',
  },
  contactTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 12px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  contactDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '15px',
    color: '#1a1a2e',
    fontWeight: '600',
  },
  orderItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '20px',
  },
  orderItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '16px',
    background: '#f9fafb',
    borderRadius: '12px',
    border: '2px solid #f0f0f0',
    transition: 'all 0.2s',
  },
  itemImageContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '10px',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  itemName: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
  },
  itemQuantity: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
    fontWeight: '500',
  },
  itemPrice: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '18px',
    fontWeight: '800',
    color: '#8b0000',
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '20px',
    borderTop: '2px solid #f0f0f0',
    flexWrap: 'wrap',
    gap: '16px',
  },
  orderTotal: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  totalLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  totalAmount: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#8b0000',
    letterSpacing: '-0.5px',
  },
  cancelButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #8b0000, #6d0000)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(139, 0, 0, 0.3)',
  },
  cancelButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  notification: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 24px',
    borderRadius: '10px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
    zIndex: 2000,
    animation: 'slideIn 0.3s ease',
    fontWeight: '600',
    fontSize: '14px',
  },
  notificationSuccess: {
    background: '#10b981',
    color: 'white',
  },
  notificationError: {
    background: '#8b0000',
    color: 'white',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '16px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)',
  },
  loadingText: {
    color: 'white',
    fontSize: '18px',
    fontWeight: '600',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
  },
};

export default Orders;