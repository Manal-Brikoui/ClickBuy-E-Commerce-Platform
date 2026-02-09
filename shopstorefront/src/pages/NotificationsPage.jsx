import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Package, 
  AlertCircle, 
  Inbox, 
  Check, 
  CheckCheck, 
  Trash2, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  User, 
  ShoppingCart,
  Truck,
  Gift,
  Clock,
  Mail,
  Phone
} from 'lucide-react';
import { 
  getAllNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} from '../api/notificationApi';
import { acceptOrder, rejectOrder, getOrderById } from '../api/orderApi';
import Navbar from '../components/Navbar';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName');

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const unreadOnly = filter === 'unread';
      const data = await getAllNotifications(unreadOnly);
      console.log('Notifications chargées:', data);
      setNotifications(data);
      
      const orderNotifications = data.filter(n => n.type === 'ORDER_RECEIVED' && n.orderId);
      for (const notif of orderNotifications) {
        await loadOrderDetails(notif.orderId);
      }
    } catch (error) {
      console.error(' Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDetails = async (orderId) => {
    try {
      console.log(' Chargement des détails de la commande:', orderId);
      const order = await getOrderById(orderId);
      console.log(' ORDER DETAILS REÇU:', order);
      console.log(' Email:', order.email);
      console.log(' Phone:', order.phone);
      console.log(' ITEMS:', order.items);
      
      if (order.items && order.items.length > 0) {
        order.items.forEach((item, index) => {
          console.log(` ITEM ${index}:`, {
            productName: item.productName,
            product: item.product,
            imageUrl: item.product?.imageUrl,
            hasProduct: !!item.product,
            hasImageUrl: !!(item.product?.imageUrl)
          });
        });
      }
      
      setOrderDetails(prev => ({
        ...prev,
        [orderId]: order
      }));
    } catch (error) {
      console.error(` Erreur chargement commande ${orderId}:`, error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error(' Erreur:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error(' Erreur:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error(' Erreur:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }
    if (notification.orderId && notification.type !== 'ORDER_RECEIVED') {
      navigate('/orders');
    }
  };

  const handleAcceptOrder = async (orderId, notificationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir accepter cette commande ?')) {
      return;
    }

    try {
      setProcessingOrderId(orderId);
      console.log(' Acceptation de la commande:', orderId);

      await acceptOrder(orderId);
      
      await handleMarkAsRead(notificationId);
      
      // Recharger les notifications pour mettre à jour l'affichage
      await loadNotifications();
      
      alert('Commande acceptée avec succès ! Le statut est maintenant "En traitement".');
    } catch (error) {
      console.error(' Erreur lors de l\'acceptation:', error);
      const errorMsg = error.response?.data?.message || 'Erreur lors de l\'acceptation de la commande';
      alert(`Erreur: ${errorMsg}`);
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleRejectOrder = async (orderId, notificationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir rejeter cette commande ? Le stock sera remis.')) {
      return;
    }

    try {
      setProcessingOrderId(orderId);
      console.log(' Rejet de la commande:', orderId);

      await rejectOrder(orderId);
      
      await handleMarkAsRead(notificationId);
      
      // Recharger les notifications pour mettre à jour l'affichage
      await loadNotifications();
      
      alert('Commande rejetée avec succès ! Le stock a été remis.');
    } catch (error) {
      console.error(' Erreur lors du rejet:', error);
      const errorMsg = error.response?.data?.message || 'Erreur lors du rejet de la commande';
      alert(`Erreur: ${errorMsg}`);
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ORDER_RECEIVED':
        return <Package size={24} color="#8b0000" />;
      case 'ORDER_STATUS_CHANGED':
        return <Bell size={24} color="#10b981" />;
      default:
        return <AlertCircle size={24} color="#1a1a2e" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <Navbar userName={userName} onLogout={handleLogout} />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .action-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          
          .accept-btn:hover {
            background: #059669 !important;
          }
          
          .reject-btn:hover {
            background: #6d0000 !important;
          }

          .order-item-card:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 12px rgba(139, 0, 0, 0.2);
          }

          .delete-only-btn:hover {
            opacity: 1 !important;
            transform: scale(1.02);
          }
          
          .back-btn:hover {
            background: rgba(255, 255, 255, 0.25) !important;
            transform: translateY(-2px);
          }
          
          .mark-all-btn:hover {
            background: rgba(255, 255, 255, 0.35) !important;
            transform: translateY(-2px);
          }
        `}
      </style>

      <Navbar userName={userName} onLogout={handleLogout} />

      <div style={styles.container}>
        <button 
          className="back-btn"
          style={styles.backButton} 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Retour
        </button>

        <div style={styles.notificationsContainer}>
          <div style={styles.notificationsHeader}>
            <h1 style={styles.headerTitle}>
              <Bell size={28} />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <button 
                className="mark-all-btn"
                style={styles.markAllReadBtn} 
                onClick={handleMarkAllAsRead}
              >
                <CheckCheck size={18} />
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div style={styles.notificationsFilters}>
            <button
              style={{
                ...styles.filterBtn,
                ...(filter === 'all' && styles.filterBtnActive)
              }}
              onClick={() => setFilter('all')}
            >
              Toutes ({notifications.length})
            </button>
            <button
              style={{
                ...styles.filterBtn,
                ...(filter === 'unread' && styles.filterBtnActive)
              }}
              onClick={() => setFilter('unread')}
            >
              Non lues ({unreadCount})
            </button>
          </div>

          <div style={styles.notificationsList}>
            {notifications.length === 0 ? (
              <div style={styles.notificationsEmpty}>
                <Inbox size={64} color="#8b0000" />
                <h3 style={styles.emptyTitle}>Aucune notification</h3>
                <p style={styles.emptyText}>
                  {filter === 'unread' 
                    ? 'Vous n\'avez aucune notification non lue' 
                    : 'Vous n\'avez aucune notification pour le moment'}
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const order = orderDetails[notif.orderId];
                
                return (
                  <div
                    key={notif.id}
                    style={{
                      ...styles.notificationCard,
                      ...(!notif.isRead && styles.notificationCardUnread)
                    }}
                  >
                    <div
                      style={styles.notificationMain}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div style={styles.notificationIcon}>
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div style={styles.notificationBody}>
                        <p style={styles.notificationMessage}>{notif.message}</p>
                        <div style={styles.notificationMeta}>
                          <span style={styles.notificationTime}>
                            <Clock size={12} style={{ marginRight: '4px', display: 'inline' }} />
                            {formatDate(notif.createdAt)}
                          </span>
                          {notif.relatedUserName && (
                            <span style={styles.notificationUser}>
                              <User size={12} style={{ marginRight: '4px', display: 'inline' }} />
                              {notif.relatedUserName}
                            </span>
                          )}
                        </div>
                      </div>
                      {!notif.isRead && <div style={styles.notificationDot}></div>}
                    </div>

                    {notif.type === 'ORDER_RECEIVED' && order && (
                      <div style={styles.orderDetailsSection}>
                        <div style={styles.clientInfoSection}>
                          <div style={styles.clientInfoHeader}>
                            <User size={16} color="#8b0000" />
                            <span style={styles.clientInfoTitle}>Informations du client</span>
                          </div>
                          
                          <div style={styles.clientInfoGrid}>
                            <div style={styles.clientInfoItem}>
                              <div style={styles.clientInfoLabel}>
                                <User size={14} color="#1a1a2e" />
                                Nom
                              </div>
                              <div style={styles.clientInfoValue}>
                                {notif.relatedUserName || 'Inconnu'}
                              </div>
                            </div>

                            {order.email && (
                              <div style={styles.clientInfoItem}>
                                <div style={styles.clientInfoLabel}>
                                  <Mail size={14} color="#1a1a2e" />
                                  Email
                                </div>
                                <div style={styles.clientInfoValue}>
                                  {order.email}
                                </div>
                              </div>
                            )}

                            {order.phone && (
                              <div style={styles.clientInfoItem}>
                                <div style={styles.clientInfoLabel}>
                                  <Phone size={14} color="#1a1a2e" />
                                  Téléphone
                                </div>
                                <div style={styles.clientInfoValue}>
                                  {order.phone}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div style={styles.orderItemsList}>
                          <div style={styles.orderItemsHeader}>
                            <Package size={16} color="#8b0000" />
                            <span style={styles.orderItemsTitle}>Produits commandés</span>
                          </div>
                          
                          {order.items && order.items.map((item, index) => {
                            console.log(` Rendu item ${index}:`, {
                              productName: item.productName,
                              imageUrl: item.product?.imageUrl,
                              fullProduct: item.product
                            });
                            
                            const imageUrl = item.product?.imageUrl;
                            
                            return (
                              <div key={index} className="order-item-card" style={styles.orderItemCard}>
                                <div style={{ position: 'relative', flexShrink: 0 }}>
                                  {imageUrl ? (
                                    <>
                                      <img 
                                        src={imageUrl} 
                                        alt={item.productName}
                                        style={styles.orderItemImage}
                                        onLoad={() => console.log(' Image chargée:', imageUrl)}
                                        onError={(e) => {
                                          console.error(' Erreur chargement image:', imageUrl);
                                          e.target.style.display = 'none';
                                          const placeholder = document.getElementById(`placeholder-${index}`);
                                          if (placeholder) {
                                            placeholder.style.display = 'flex';
                                          }
                                        }}
                                      />
                                      <div 
                                        style={{
                                          ...styles.orderItemImagePlaceholder,
                                          display: 'none'
                                        }}
                                        id={`placeholder-${index}`}
                                      >
                                        <Package size={24} color="#8b0000" />
                                      </div>
                                    </>
                                  ) : (
                                    <div style={styles.orderItemImagePlaceholder}>
                                      <Package size={24} color="#8b0000" />
                                    </div>
                                  )}
                                </div>
                                
                                <div style={styles.orderItemInfo}>
                                  <p style={styles.orderItemName}>{item.productName}</p>
                                  <div style={styles.orderItemDetails}>
                                    <span style={styles.orderItemQuantity}>
                                      <ShoppingCart size={14} />
                                      Qté: {item.quantity}
                                    </span>
                                    <span style={styles.orderItemPrice}>
                                      {item.price} DH × {item.quantity} = {item.price * item.quantity} DH
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div style={styles.orderTotal}>
                          <span style={styles.orderTotalLabel}>Total de la commande:</span>
                          <span style={styles.orderTotalAmount}>{order.totalAmount} DH</span>
                        </div>

                        {order.status === 'Pending' && (
                          <div style={styles.orderActions}>
                            <button
                              className="action-btn accept-btn"
                              style={styles.acceptBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcceptOrder(notif.orderId, notif.id);
                              }}
                              disabled={processingOrderId === notif.orderId}
                            >
                              <CheckCircle size={16} />
                              {processingOrderId === notif.orderId ? 'En cours...' : 'Accepter'}
                            </button>
                            <button
                              className="action-btn reject-btn"
                              style={styles.rejectBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRejectOrder(notif.orderId, notif.id);
                              }}
                              disabled={processingOrderId === notif.orderId}
                            >
                              <XCircle size={16} />
                              {processingOrderId === notif.orderId ? 'En cours...' : 'Rejeter'}
                            </button>
                          </div>
                        )}

                        {order.status !== 'Pending' && (
                          <div style={styles.orderStatusBadge}>
                            {order.status === 'Processing' && (
                              <span style={styles.statusProcessing}>
                                <CheckCircle size={16} style={{ marginRight: '6px', display: 'inline' }} />
                                Commande acceptée
                              </span>
                            )}
                            {order.status === 'Cancelled' && (
                              <span style={styles.statusCancelled}>
                                <XCircle size={16} style={{ marginRight: '6px', display: 'inline' }} />
                                Commande rejetée
                              </span>
                            )}
                            {order.status === 'Shipped' && (
                              <span style={styles.statusShipped}>
                                <Truck size={16} style={{ marginRight: '6px', display: 'inline' }} />
                                Commande expédiée
                              </span>
                            )}
                            {order.status === 'Delivered' && (
                              <span style={styles.statusDelivered}>
                                <Gift size={16} style={{ marginRight: '6px', display: 'inline' }} />
                                Commande livrée
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {notif.type !== 'ORDER_RECEIVED' && (
                      <div style={styles.notificationActions}>
                        {!notif.isRead && (
                          <button
                            style={styles.actionBtnRead}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notif.id);
                            }}
                            title="Marquer comme lu"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          style={styles.actionBtnDelete}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notif.id);
                          }}
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}

                    {notif.type === 'ORDER_RECEIVED' && (
                      <div style={styles.deleteButtonContainer}>
                        <button
                          className="delete-only-btn"
                          style={styles.deleteOnlyBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Voulez-vous vraiment supprimer cette notification ?')) {
                              handleDelete(notif.id);
                            }
                          }}
                          title="Supprimer la notification"
                        >
                          <Trash2 size={16} />
                          Supprimer la notification
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
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
    maxWidth: '1000px',
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
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '20px',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
  notificationsContainer: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    border: '2px solid #f0f0f0',
  },
  notificationsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    background: 'linear-gradient(135deg, #8b0000 0%, #6d0000 100%)',
    color: 'white',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '24px',
    fontWeight: '800',
    margin: 0,
  },
  markAllReadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: 'rgba(255, 255, 255, 0.25)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
  notificationsFilters: {
    display: 'flex',
    gap: '12px',
    padding: '20px 24px',
    borderBottom: '2px solid #f0f0f0',
  },
  filterBtn: {
    padding: '10px 20px',
    background: '#f5f5f5',
    color: '#1a1a2e',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  filterBtnActive: {
    background: '#8b0000',
    color: 'white',
    borderColor: '#8b0000',
  },
  notificationsList: {
    maxHeight: '700px',
    overflowY: 'auto',
  },
  notificationsEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    gap: '16px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
  },
  emptyText: {
    fontSize: '14px',
    color: '#1a1a2e',
    margin: 0,
    textAlign: 'center',
    fontWeight: '600',
  },
  notificationCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 24px',
    borderBottom: '2px solid #f0f0f0',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    gap: '16px',
  },
  notificationCardUnread: {
    background: 'linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%)',
  },
  notificationMain: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  notificationIcon: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(139, 0, 0, 0.1)',
    flexShrink: 0,
    border: '2px solid #f0f0f0',
  },
  notificationBody: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  notificationMessage: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a2e',
    margin: 0,
    lineHeight: 1.5,
  },
  notificationMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#1a1a2e',
    flexWrap: 'wrap',
    fontWeight: '600',
  },
  notificationTime: {
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
  },
  notificationUser: {
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
  },
  notificationDot: {
    width: '10px',
    height: '10px',
    background: '#8b0000',
    borderRadius: '50%',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(139, 0, 0, 0.4)',
  },
  notificationActions: {
    display: 'flex',
    gap: '8px',
    marginLeft: 'auto',
  },
  actionBtnRead: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
  },
  actionBtnDelete: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#8b0000',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(139, 0, 0, 0.3)',
  },
  orderDetailsSection: {
    marginTop: '12px',
    marginLeft: '64px',
    padding: '20px',
    background: '#f5f5f5',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  clientInfoSection: {
    background: 'white',
    padding: '16px',
    borderRadius: '10px',
    border: '2px solid #8b0000',
  },
  clientInfoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    paddingBottom: '10px',
    borderBottom: '2px solid #e0e0e0',
  },
  clientInfoTitle: {
    fontSize: '14px',
    color: '#1a1a2e',
    fontWeight: '700',
  },
  clientInfoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },
  clientInfoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '10px',
    background: '#f5f5f5',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  clientInfoLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#1a1a2e',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  clientInfoValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  orderItemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  orderItemsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  orderItemsTitle: {
    fontSize: '14px',
    color: '#1a1a2e',
    fontWeight: '700',
  },
  orderItemCard: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    background: 'white',
    borderRadius: '10px',
    border: '2px solid #e0e0e0',
    transition: 'all 0.3s ease',
  },
  orderItemImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    flexShrink: 0,
  },
  orderItemImagePlaceholder: {
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f5f5',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    flexShrink: 0,
  },
  orderItemInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  orderItemName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
  },
  orderItemDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  orderItemQuantity: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#1a1a2e',
    fontWeight: '600',
  },
  orderItemPrice: {
    fontSize: '13px',
    color: '#8b0000',
    fontWeight: '700',
  },
  orderTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: '#8b0000',
    borderRadius: '10px',
  },
  orderTotalLabel: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'white',
  },
  orderTotalAmount: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'white',
  },
  orderActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  acceptBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
  },
  rejectBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#8b0000',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(139, 0, 0, 0.3)',
  },
  orderStatusBadge: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px',
  },
  statusProcessing: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    background: '#10b981',
    color: 'white',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
  },
  statusCancelled: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    background: '#8b0000',
    color: 'white',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
  },
  statusShipped: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    background: '#3b82f6',
    color: 'white',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
  },
  statusDelivered: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    background: '#8b5cf6',
    color: 'white',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
  },
  deleteButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '8px',
  },
  deleteOnlyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: '#8b0000',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    opacity: 0.8,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '700',
  },
};

export default NotificationsPage;