import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, updateCart, removeFromCart, clearCart } from '../api/cartApi';
import { createOrder } from '../api/orderApi';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader,
  ShoppingBag,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const normalizeItem = (item) => {
  return {
    id:           item.Id           ?? item.id,
    productId:    item.ProductId    ?? item.productId,
    productName:  item.ProductName  ?? item.productName  ?? item.product?.name  ?? 'Produit inconnu',
    productPrice: item.ProductPrice ?? item.productPrice ?? item.product?.price ?? 0,
    productImage: item.ProductImage ?? item.productImage ?? item.product?.imageUrl ?? null,
    quantity:     item.Quantity      ?? item.quantity     ?? 1,
    userName:     item.product?.userName ?? 'Vendeur inconnu',
  };
};

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showCheckout, setShowCheckout] = useState(false);
  

  const [checkoutData, setCheckoutData] = useState({
    email: '',
    phone: '',
    shippingAddress: '',
  });
  
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const userName = localStorage.getItem('userName');
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  
  // Récupérer l'email de l'utilisateur depuis localStorage
  const userEmail = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCart();
    
  
    if (userEmail) {
      setCheckoutData(prev => ({ ...prev, email: userEmail }));
    }
  }, [token, navigate, userEmail]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();

      const raw = Array.isArray(data) ? data : (data?.items || []);
      const items = raw.map(normalizeItem);

      console.log(' Panier normalisé:', items);
      setCartItems(items);
    } catch (error) {
      console.error(' Erreur fetchCart:', error);
      showNotification('Erreur lors du chargement du panier', 'error');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleUpdateQuantity = async (cartItemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    try {
      setUpdating(true);
      await updateCart(cartItemId, newQuantity);
      showNotification('Quantité mise à jour', 'success');
      await fetchCart();
    } catch (error) {
      console.error(' Erreur mise à jour:', error);
      showNotification('Erreur lors de la mise à jour', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!window.confirm('Voulez-vous retirer cet article du panier ?')) return;

    try {
      setUpdating(true);
      await removeFromCart(productId);
      showNotification('Article retiré du panier', 'success');
      await fetchCart();
    } catch (error) {
      console.error(' Erreur suppression:', error);
      showNotification('Erreur lors de la suppression', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Voulez-vous vider complètement votre panier ?')) return;

    try {
      setUpdating(true);
      await clearCart();
      showNotification('Panier vidé', 'success');
      await fetchCart();
    } catch (error) {
      console.error(' Erreur vidage:', error);
      showNotification('Erreur lors du vidage du panier', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
   
    const phoneRegex = /^(\+212|0)[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleCheckout = async () => {
    console.log(' VALIDATION CHECKOUT ');
    console.log('Email:', checkoutData.email);
    console.log('Phone:', checkoutData.phone);
    console.log('Address:', checkoutData.shippingAddress);


    if (!checkoutData.email.trim()) {
      showNotification('Veuillez entrer votre email', 'error');
      return;
    }

    if (!validateEmail(checkoutData.email)) {
      showNotification('Format d\'email invalide', 'error');
      return;
    }

    if (!checkoutData.phone.trim()) {
      showNotification('Veuillez entrer votre numéro de téléphone', 'error');
      return;
    }

    const cleanPhone = checkoutData.phone.replace(/\s/g, '');
    if (!validatePhone(cleanPhone)) {
      showNotification('Format de téléphone invalide (format marocain requis: +212XXXXXXXXX ou 0XXXXXXXXX)', 'error');
      return;
    }

    // Validation adresse
    if (!checkoutData.shippingAddress.trim()) {
      showNotification('Veuillez entrer une adresse de livraison', 'error');
      return;
    }

    if (cartItems.length === 0) {
      showNotification('Votre panier est vide', 'error');
      return;
    }

    if (!userId) {
      showNotification('Erreur: utilisateur non identifié', 'error');
      return;
    }

    try {
      setCheckoutLoading(true);


      const orderData = {
        userId: parseInt(userId),
        email: checkoutData.email.trim(),
        phone: cleanPhone,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      console.log(' Order Data:', orderData);
      const response = await createOrder(orderData);
      console.log(' Commande créée:', response);
      console.log(' Email dans la réponse:', response.email);
      console.log(' Phone dans la réponse:', response.phone);

      try { await clearCart(); } catch (e) { console.warn(' Vidage panier après commande échoué:', e); }

      showNotification('Commande créée avec succès !', 'success');
      setTimeout(() => navigate('/orders'), 1500);
    } catch (error) {
      console.error(' Erreur checkout:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Erreur lors de la création de la commande';
      showNotification(errorMsg, 'error');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.productPrice * item.quantity, 0);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5017${imagePath}`;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Loader style={styles.spinner} size={48} color="#8b0000" />
        <p style={styles.loadingText}>Chargement du panier...</p>
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
          @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>

      <Navbar userName={userName} onLogout={handleLogout} />

      {notification.show && (
        <div style={{ ...styles.notification, ...(notification.type === 'success' ? styles.notificationSuccess : styles.notificationError) }}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{notification.message}</span>
        </div>
      )}

      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>
            <ShoppingCart size={28} />
            Mon Panier
          </h2>
          {cartItems.length > 0 && (
            <button 
              style={styles.clearButton} 
              onClick={handleClearCart} 
              disabled={updating}
              onMouseEnter={(e) => {
                if (!updating) {
                  e.currentTarget.style.background = '#6d0000';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 0, 0, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!updating) {
                  e.currentTarget.style.background = '#8b0000';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 0, 0, 0.3)';
                }
              }}
            >
              <Trash2 size={18} />
              Vider le panier
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div style={styles.emptyCart}>
            <ShoppingBag size={80} color="#8b0000" />
            <h3 style={styles.emptyTitle}>Votre panier est vide</h3>
            <p style={styles.emptyText}>Ajoutez des produits pour commencer vos achats</p>
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
              <Package size={20} />
              Découvrir nos produits
            </button>
          </div>
        ) : (
          <div style={styles.cartContent}>
            <div style={styles.cartItems}>
              {cartItems.map((item) => {
                const imageUrl = getImageUrl(item.productImage);

                return (
                  <div 
                    key={item.id} 
                    style={styles.cartItem}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#8b0000';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#f0f0f0';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                  
                    <div style={styles.itemImage}>
                      {imageUrl ? (
                        <>
                          <img
                            src={imageUrl}
                            alt={item.productName}
                            style={styles.productImage}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const ph = e.target.parentElement.querySelector('.img-placeholder');
                              if (ph) ph.style.display = 'flex';
                            }}
                          />
                          <div className="img-placeholder" style={{ ...styles.noImage, display: 'none' }}>
                            <Package size={50} color="#1a1a2e" />
                          </div>
                        </>
                      ) : (
                        <div style={styles.noImage}>
                          <Package size={50} color="#1a1a2e" />
                        </div>
                      )}
                    </div>

             
                    <div style={styles.itemDetails}>
                      <h3 style={styles.itemName}>{item.productName}</h3>
                      
                 
                      <div style={styles.sellerSection}>
                        <User size={14} color="#1a1a2e" />
                        <span style={styles.sellerName}>
                          Vendu par: {item.userName}
                        </span>
                      </div>

                      <div style={styles.itemPrice}>
                        <DollarSign size={18} color="#8b0000" />
                        <span>{item.productPrice.toFixed(2)} DH</span>
                      </div>
                    </div>

                    {/* QUANTITÉ + TOTAL LIGNE + SUPPRIMER */}
                    <div style={styles.itemActions}>
                      <div style={styles.quantityControl}>
                        <button
                          style={{
                            ...styles.quantityButton,
                            ...(updating && styles.buttonDisabled),
                          }}
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          disabled={updating || item.quantity <= 1}
                          onMouseEnter={(e) => {
                            if (!updating && item.quantity > 1) {
                              e.currentTarget.style.borderColor = '#8b0000';
                              e.currentTarget.style.color = '#8b0000';
                              e.currentTarget.style.transform = 'scale(1.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!updating && item.quantity > 1) {
                              e.currentTarget.style.borderColor = '#e0e0e0';
                              e.currentTarget.style.color = '#1a1a2e';
                              e.currentTarget.style.transform = 'scale(1)';
                            }
                          }}
                        >
                          <Minus size={16} />
                        </button>
                        <span style={styles.quantity}>{item.quantity}</span>
                        <button
                          style={{
                            ...styles.quantityButton,
                            ...(updating && styles.buttonDisabled),
                          }}
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          disabled={updating}
                          onMouseEnter={(e) => {
                            if (!updating) {
                              e.currentTarget.style.borderColor = '#8b0000';
                              e.currentTarget.style.color = '#8b0000';
                              e.currentTarget.style.transform = 'scale(1.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!updating) {
                              e.currentTarget.style.borderColor = '#e0e0e0';
                              e.currentTarget.style.color = '#1a1a2e';
                              e.currentTarget.style.transform = 'scale(1)';
                            }
                          }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div style={styles.itemTotal}>
                        <span style={styles.totalLabel}>Total</span>
                        <span style={styles.totalPrice}>
                          {(item.productPrice * item.quantity).toFixed(2)} DH
                        </span>
                      </div>

                      <button
                        style={{
                          ...styles.removeButton,
                          ...(updating && styles.buttonDisabled),
                        }}
                        onClick={() => handleRemoveItem(item.productId)}
                        disabled={updating}
                        onMouseEnter={(e) => {
                          if (!updating) {
                            e.currentTarget.style.background = '#8b0000';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 0, 0, 0.3)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!updating) {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = '#8b0000';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        {updating ? <Loader style={{ animation: 'spin 1s linear infinite' }} size={18} /> : <Trash2 size={18} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

   
            <div style={styles.orderSummary}>
              <h3 style={styles.summaryTitle}>Résumé de la commande</h3>
              <div style={styles.summaryDetails}>
                <div style={styles.summaryRow}>
                  <span>Nombre d'articles:</span>
                  <span style={styles.summaryValue}>
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Total produits:</span>
                  <span style={styles.summaryValue}>{calculateTotal().toFixed(2)} DH</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Livraison:</span>
                  <span style={styles.freeShipping}>Gratuite</span>
                </div>
                <div style={styles.summaryDivider} />
                <div style={styles.summaryRow}>
                  <span style={styles.summaryTotal}>Total:</span>
                  <span style={{ ...styles.summaryValue, ...styles.summaryTotal }}>
                    {calculateTotal().toFixed(2)} DH
                  </span>
                </div>
              </div>

              {!showCheckout ? (
                <button 
                  style={styles.checkoutButton} 
                  onClick={() => setShowCheckout(true)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#059669';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#10b981';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  Passer la commande
                </button>
              ) : (
                <div style={styles.checkoutForm}>
               
                  <div style={styles.formGroup}>
                    <label style={styles.checkoutLabel}>
                      <Mail size={14} color="#8b0000" />
                      Email *
                    </label>
                    <input
                      type="email"
                      style={styles.checkoutInput}
                      placeholder="exemple@email.com"
                      value={checkoutData.email}
                      onChange={(e) => setCheckoutData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={checkoutLoading}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#8b0000';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 0, 0, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e0e0e0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                
                  <div style={styles.formGroup}>
                    <label style={styles.checkoutLabel}>
                      <Phone size={14} color="#8b0000" />
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      style={styles.checkoutInput}
                      placeholder="+212 6XX XX XX XX ou 06XX XX XX XX"
                      value={checkoutData.phone}
                      onChange={(e) => setCheckoutData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={checkoutLoading}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#8b0000';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 0, 0, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e0e0e0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* CHAMP ADRESSE */}
                  <div style={styles.formGroup}>
                    <label style={styles.checkoutLabel}>Adresse de livraison *</label>
                    <textarea
                      style={styles.checkoutTextarea}
                      placeholder="Entrez votre adresse complète..."
                      value={checkoutData.shippingAddress}
                      onChange={(e) => setCheckoutData(prev => ({ ...prev, shippingAddress: e.target.value }))}
                      rows={4}
                      disabled={checkoutLoading}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#8b0000';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 0, 0, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e0e0e0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div style={styles.checkoutActions}>
                    <button
                      style={styles.cancelCheckoutButton}
                      onClick={() => { 
                        setShowCheckout(false); 
                        setCheckoutData({ email: userEmail, phone: '', shippingAddress: '' }); 
                      }}
                      disabled={checkoutLoading}
                      onMouseEnter={(e) => {
                        if (!checkoutLoading) {
                          e.currentTarget.style.background = '#e0e0e0';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!checkoutLoading) {
                          e.currentTarget.style.background = '#f5f5f5';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      style={{ ...styles.confirmCheckoutButton, ...(checkoutLoading && styles.confirmCheckoutButtonDisabled) }}
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                      onMouseEnter={(e) => {
                        if (!checkoutLoading) {
                          e.currentTarget.style.background = '#059669';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!checkoutLoading) {
                          e.currentTarget.style.background = '#10b981';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                        }
                      }}
                    >
                      {checkoutLoading ? (
                        <><Loader style={styles.spinner} size={18} /> Traitement...</>
                      ) : 'Confirmer'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
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
    padding: '30px 20px' 
  },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '30px', 
    flexWrap: 'wrap', 
    gap: '16px' 
  },
  headerTitle: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px', 
    fontSize: '26px', 
    color: 'white', 
    margin: 0, 
    fontWeight: '800' 
  },
  clearButton: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    padding: '12px 24px', 
    background: '#8b0000', 
    color: 'white', 
    border: 'none', 
    borderRadius: '12px', 
    fontSize: '14px', 
    fontWeight: '700', 
    cursor: 'pointer', 
    boxShadow: '0 4px 12px rgba(139, 0, 0, 0.3)', 
    transition: 'all 0.3s ease' 
  },
  emptyCart: { 
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
    fontWeight: '800' 
  },
  emptyText: { 
    fontSize: '16px', 
    color: '#1a1a2e', 
    margin: 0,
    fontWeight: '600',
  },
  shopButton: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
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
    transition: 'all 0.3s ease' 
  },
  cartContent: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 400px', 
    gap: '24px' 
  },
  cartItems: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '16px' 
  },
  cartItem: { 
    background: 'white',
    borderRadius: '16px', 
    padding: '24px', 
    display: 'flex', 
    gap: '24px', 
    alignItems: 'center', 
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', 
    border: '2px solid #f0f0f0',
    transition: 'all 0.3s ease',
  },
  itemImage: { 
    width: '140px', 
    height: '140px', 
    borderRadius: '12px', 
    overflow: 'hidden', 
    background: '#f5f5f5',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    position: 'relative', 
    flexShrink: 0, 
    border: '2px solid #e0e0e0',
  },
  productImage: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover' 
  },
  noImage: { 
    position: 'absolute', 
    width: '100%', 
    height: '100%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  itemDetails: { 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '12px' 
  },
  itemName: { 
    fontSize: '20px', 
    fontWeight: '700', 
    color: '#1a1a2e', 
    margin: 0 
  },
  sellerSection: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    padding: '8px 12px', 
    background: '#f5f5f5', 
    borderRadius: '8px', 
    width: 'fit-content',
    border: '1px solid #e0e0e0',
  },
  sellerName: { 
    fontSize: '13px', 
    color: '#1a1a2e', 
    fontWeight: '600' 
  },
  itemPrice: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '6px', 
    fontSize: '18px', 
    color: '#8b0000', 
    fontWeight: '700', 
    margin: 0, 
    padding: '8px 12px', 
    background: 'white', 
    border: '2px solid #8b0000',
    borderRadius: '8px', 
    width: 'fit-content' 
  },
  itemActions: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'flex-end', 
    gap: '16px' 
  },
  quantityControl: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px', 
    background: '#f5f5f5',
    borderRadius: '12px', 
    padding: '8px',
    border: '2px solid #e0e0e0',
  },
  quantityButton: { 
    width: '36px', 
    height: '36px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    background: 'white', 
    border: '2px solid #e0e0e0', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    color: '#1a1a2e', 
    fontWeight: '700', 
    transition: 'all 0.3s ease' 
  },
  buttonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  quantity: { 
    fontSize: '18px', 
    fontWeight: '700', 
    minWidth: '40px', 
    textAlign: 'center', 
    color: '#1a1a2e' 
  },
  itemTotal: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'flex-end', 
    gap: '6px', 
    padding: '12px 16px', 
    background: 'white',
    border: '2px solid #8b0000',
    borderRadius: '12px' 
  },
  totalLabel: { 
    fontSize: '13px', 
    color: '#1a1a2e', 
    fontWeight: '600' 
  },
  totalPrice: { 
    fontSize: '20px', 
    fontWeight: '800', 
    color: '#8b0000' 
  },
  removeButton: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: '10px', 
    background: 'white', 
    color: '#8b0000', 
    border: '2px solid #8b0000', 
    borderRadius: '10px', 
    cursor: 'pointer', 
    fontWeight: '700', 
    transition: 'all 0.3s ease' 
  },
  orderSummary: { 
    background: 'white', 
    borderRadius: '16px', 
    padding: '24px', 
    height: 'fit-content', 
    position: 'sticky', 
    top: '100px', 
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', 
    border: '2px solid #f0f0f0' 
  },
  summaryTitle: { 
    fontSize: '20px', 
    fontWeight: '700', 
    color: '#1a1a2e', 
    marginBottom: '20px' 
  },
  summaryDetails: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '12px', 
    marginBottom: '20px' 
  },
  summaryRow: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    fontSize: '14px', 
    color: '#1a1a2e', 
    fontWeight: '600' 
  },
  summaryValue: { 
    fontWeight: '700', 
    color: '#1a1a2e' 
  },
  summaryDivider: { 
    height: '1px', 
    background: '#e0e0e0', 
    margin: '8px 0' 
  },
  freeShipping: { 
    color: '#10b981', 
    fontWeight: '700' 
  },
  summaryTotal: { 
    fontSize: '18px', 
    fontWeight: '800', 
    color: '#1a1a2e' 
  },
  checkoutButton: { 
    width: '100%', 
    padding: '16px', 
    background: '#10b981', 
    color: 'white', 
    border: 'none', 
    borderRadius: '12px', 
    fontSize: '16px', 
    fontWeight: '700', 
    cursor: 'pointer', 
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', 
    transition: 'all 0.3s ease' 
  },
  checkoutForm: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '16px' 
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  checkoutLabel: { 
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px', 
    fontWeight: '700', 
    color: '#1a1a2e' 
  },
  checkoutInput: {
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    color: '#1a1a2e',
  },
  checkoutTextarea: { 
    padding: '12px', 
    border: '2px solid #e0e0e0', 
    borderRadius: '8px', 
    fontSize: '14px', 
    resize: 'vertical', 
    outline: 'none', 
    fontFamily: 'inherit', 
    fontWeight: '500', 
    transition: 'all 0.3s ease',
    color: '#1a1a2e',
  },
  checkoutActions: { 
    display: 'flex', 
    gap: '10px',
    marginTop: '8px',
  },
  cancelCheckoutButton: { 
    flex: 1, 
    padding: '12px', 
    background: '#f5f5f5', 
    color: '#1a1a2e', 
    border: '2px solid #e0e0e0', 
    borderRadius: '10px', 
    fontSize: '14px', 
    fontWeight: '700', 
    cursor: 'pointer', 
    transition: 'all 0.3s ease' 
  },
  confirmCheckoutButton: { 
    flex: 1, 
    padding: '12px', 
    background: '#10b981', 
    color: 'white', 
    border: 'none', 
    borderRadius: '10px', 
    fontSize: '14px', 
    fontWeight: '700', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '8px', 
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', 
    transition: 'all 0.3s ease' 
  },
  confirmCheckoutButtonDisabled: { 
    opacity: 0.7, 
    cursor: 'not-allowed' 
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
    fontSize: '14px' 
  },
  notificationSuccess: { 
    background: '#10b981', 
    color: 'white' 
  },
  notificationError: { 
    background: '#8b0000', 
    color: 'white' 
  },
  loadingContainer: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '100vh', 
    gap: '16px', 
    background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)' 
  },
  loadingText: { 
    color: 'white', 
    fontSize: '18px', 
    fontWeight: '700' 
  },
  spinner: { 
    animation: 'spin 1s linear infinite' 
  },
};

export default Cart;