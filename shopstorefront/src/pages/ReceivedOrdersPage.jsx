import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReceivedOrders, updateOrderStatus } from '../api/orderApi';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  Calendar,
  DollarSign,
  User,
  ArrowLeft,
  Play,
  Truck,
  Ban,
} from 'lucide-react';
import Navbar from '../components/Navbar';

const ReceivedOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');

  useEffect(() => {
    console.log('=== [#] RECEIVED ORDERS PAGE - INITIALISATION ===');
    console.log('Token présent:', !!token);

    if (!token) {
      console.warn('[!] Pas de token - Redirection vers login');
      navigate('/login');
      return;
    }

    fetchReceivedOrders();
  }, [token, navigate]);

  const fetchReceivedOrders = async () => {
    try {
      setLoading(true);
      console.log('[<-] Récupération des commandes reçues...');

      const data = await getReceivedOrders();
      console.log('[✓] Commandes reçues récupérées:', data);

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('[X] Erreur fetchReceivedOrders:', error);
      showNotification('Erreur lors du chargement des commandes reçues', 'error');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      console.log('[->] Déconnexion de l\'utilisateur');
      localStorage.clear();
      navigate('/login');
    }
  };

  const showNotification = (message, type = 'success') => {
    console.log(`[i] Notification [${type}]:`, message);
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const statusLabels = {
      'Processing': 'En traitement',
      'Shipped': 'Expédiée',
      'Delivered': 'Livrée',
      'Cancelled': 'Annulée',
    };

    if (!window.confirm(`Changer le statut de la commande en "${statusLabels[newStatus]}" ?`)) {
      return;
    }

    try {
      setUpdatingOrderId(orderId);
      console.log('[~] Mise à jour du statut:', orderId, '→', newStatus);

      await updateOrderStatus(orderId, newStatus);
      showNotification(`Statut changé en "${statusLabels[newStatus]}"`, 'success');
      await fetchReceivedOrders();
    } catch (error) {
      console.error('[X] Erreur lors de la mise à jour:', error);
      const errorMsg = error.response?.data?.message || 'Erreur lors de la mise à jour';
      showNotification(errorMsg, 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusStyle = (status) => {
    const statusStyles = {
      Pending: { background: '#fef3c7', color: '#92400e', icon: Clock },
      Processing: { background: '#dbeafe', color: '#1e40af', icon: Package },
      Shipped: { background: '#e0e7ff', color: '#4338ca', icon: Package },
      Delivered: { background: '#d1fae5', color: '#065f46', icon: CheckCircle },
      Cancelled: { background: '#fee2e2', color: '#991b1b', icon: XCircle },
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

  const getNextStatuses = (currentStatus) => {
    const transitions = {
      'Pending': ['Processing', 'Cancelled'],
      'Processing': ['Shipped', 'Cancelled'],
      'Shipped': ['Delivered'],
      'Delivered': [],
      'Cancelled': [],
    };
    return transitions[currentStatus] || [];
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Loader style={styles.spinner} size={48} color="#8b0000" />
        <p style={styles.loadingText}>Chargement des commandes reçues...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
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
          .status-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(139, 0, 0, 0.3);
          }
        `}
      </style>

      <Navbar userName={userName} onLogout={handleLogout} />

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
        <button 
          style={styles.backButton} 
          onClick={() => navigate(-1)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#1a1a2e';
            e.currentTarget.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <ArrowLeft size={18} />
          Retour
        </button>

        <div style={styles.header}>
          <h2 style={styles.headerTitle}>
            <Package size={28} />
            Commandes Reçues
          </h2>
          <p style={styles.headerSubtitle}>
            Gérez les commandes passées pour vos produits
          </p>
        </div>

        {orders.length === 0 ? (
          <div style={styles.emptyOrders}>
            <Package size={80} color="#8b0000" />
            <h3 style={styles.emptyTitle}>Aucune commande reçue</h3>
            <p style={styles.emptyText}>Vous n'avez pas encore reçu de commande pour vos produits</p>
            <button 
              style={styles.shopButton} 
              onClick={() => navigate('/products')}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#6d0000';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#8b0000';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 0, 0, 0.3)';
              }}
            >
              Voir mes produits
            </button>
          </div>
        ) : (
          <div style={styles.ordersGrid}>
            {orders.map((order) => {
              const statusStyle = getStatusStyle(order.status);
              const StatusIcon = statusStyle.icon;
              const nextStatuses = getNextStatuses(order.status);

              return (
                <div 
                  key={order.id} 
                  style={styles.orderCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={styles.orderHeader}>
                    <div style={styles.orderHeaderLeft}>
                      <h3 style={styles.orderId}>Commande #{order.id}</h3>
                      <div style={styles.orderDate}>
                        <Calendar size={16} />
                        {formatDate(order.orderDate)}
                      </div>
                      <div style={styles.orderBuyer}>
                        <User size={16} />
                        Acheteur: {order.userName || 'Anonyme'}
                      </div>
                    </div>
                    <div
                      style={{
                        ...styles.statusBadge,
                        background: statusStyle.background,
                        color: statusStyle.color,
                      }}
                    >
                      <StatusIcon size={16} />
                      {getStatusText(order.status)}
                    </div>
                  </div>

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
                              <Package size={24} color="#1a1a2e" />
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
                            <DollarSign size={16} />
                            {totalPrice.toFixed(2)} DH
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={styles.orderFooter}>
                    <div style={styles.orderTotal}>
                      <span style={styles.totalLabel}>Total:</span>
                      <span style={styles.totalAmount}>
                        {order.totalAmount?.toFixed(2) || '0.00'} DH
                      </span>
                    </div>

                    {nextStatuses.length > 0 && (
                      <div style={styles.statusActions}>
                        <span style={styles.statusActionsLabel}>Changer le statut:</span>
                        {nextStatuses.map((status) => (
                          <button
                            key={status}
                            className="status-button"
                            style={{
                              ...styles.statusButton,
                              ...(updatingOrderId === order.id && styles.statusButtonDisabled),
                            }}
                            onClick={() => handleStatusChange(order.id, status)}
                            disabled={updatingOrderId === order.id}
                          >
                            {updatingOrderId === order.id ? (
                              <>
                                <Loader style={styles.spinner} size={16} />
                                En cours...
                              </>
                            ) : (
                              <>
                                {status === 'Processing' && (
                                  <>
                                    <Play size={16} />
                                    En traitement
                                  </>
                                )}
                                {status === 'Shipped' && (
                                  <>
                                    <Truck size={16} />
                                    Expédiée
                                  </>
                                )}
                                {status === 'Delivered' && (
                                  <>
                                    <CheckCircle size={16} />
                                    Livrée
                                  </>
                                )}
                                {status === 'Cancelled' && (
                                  <>
                                    <Ban size={16} />
                                    Annuler
                                  </>
                                )}
                              </>
                            )}
                          </button>
                        ))}
                      </div>
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
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '20px',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
  header: {
    marginBottom: '30px',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '26px',
    color: 'white',
    margin: 0,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: '8px',
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
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    gap: '20px',
    border: '2px solid #f0f0f0',
  },
  emptyTitle: {
    fontSize: '24px',
    color: '#1a1a2e',
    margin: 0,
    fontWeight: '800',
  },
  emptyText: {
    fontSize: '16px',
    color: '#1a1a2e',
    margin: 0,
    fontWeight: '500',
    opacity: 0.8,
  },
  shopButton: {
    padding: '12px 24px',
    background: '#8b0000',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 4px 12px rgba(139, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
  },
  ordersGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  orderCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    animation: 'fadeIn 0.3s ease',
    border: '2px solid #f0f0f0',
    transition: 'all 0.3s ease',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '2px solid #f0f0f0',
  },
  orderHeaderLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  orderId: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
  },
  orderDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#1a1a2e',
    fontWeight: '600',
    opacity: 0.7,
  },
  orderBuyer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#8b0000',
    fontWeight: '700',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '700',
  },
  orderItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  },
  orderItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    background: '#f5f5f5',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
  },
  itemImageContainer: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    overflow: 'hidden',
    background: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
    border: '2px solid #e0e0e0',
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
    gap: '4px',
  },
  itemName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
  },
  itemQuantity: {
    fontSize: '14px',
    color: '#1a1a2e',
    margin: 0,
    fontWeight: '600',
    opacity: 0.7,
  },
  itemPrice: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#8b0000',
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '2px solid #f0f0f0',
    flexWrap: 'wrap',
    gap: '16px',
  },
  orderTotal: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  totalLabel: {
    fontSize: '14px',
    color: '#1a1a2e',
    fontWeight: '600',
    opacity: 0.7,
  },
  totalAmount: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#8b0000',
  },
  statusActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  statusActionsLabel: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a1a2e',
    opacity: 0.7,
  },
  statusButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: '#8b0000',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(139, 0, 0, 0.3)',
  },
  statusButtonDisabled: {
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
    fontWeight: '700',
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
    fontWeight: '700',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
  },
};

export default ReceivedOrdersPage;