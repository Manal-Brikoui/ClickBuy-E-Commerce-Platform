import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orderApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader,
  ShoppingBag,
  DollarSign,
  Package,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearAllCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: '',
    shippingAddress: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cash',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^(\+212|0)[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(' VALIDATION DU FORMULAIRE ');
    console.log('Email:', formData.email);
    console.log('Phone:', formData.phone);

    //  Validation Email
    if (!formData.email.trim()) {
      showNotification('Veuillez entrer votre email', 'error');
      return;
    }

    if (!validateEmail(formData.email)) {
      showNotification('Format d\'email invalide', 'error');
      return;
    }

    //  Validation Phone
    if (!formData.phone.trim()) {
      showNotification('Veuillez entrer votre numéro de téléphone', 'error');
      return;
    }

    const cleanPhone = formData.phone.replace(/\s/g, '');
    if (!validatePhone(cleanPhone)) {
      showNotification('Format de téléphone invalide (format marocain requis: +212XXXXXXXXX ou 0XXXXXXXXX)', 'error');
      return;
    }

    // Validation adresse
    if (!formData.shippingAddress.trim()) {
      showNotification('Veuillez entrer une adresse de livraison', 'error');
      return;
    }

    if (!formData.city.trim()) {
      showNotification('Veuillez entrer une ville', 'error');
      return;
    }

    try {
      setLoading(true);
      console.log(' CRÉATION DE LA COMMANDE ');
      console.log('UserId:', user?.id);
      console.log('Email:', formData.email);
      console.log('Phone:', cleanPhone);

      const orderData = {
        userId: user?.id,
        email: formData.email.trim(),
        phone: cleanPhone,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      console.log(' Données envoyées au backend:', orderData);

      const createdOrder = await createOrder(orderData);
      
      console.log(' Commande créée avec succès:', createdOrder);
      console.log(' Email dans la réponse:', createdOrder.email);
      console.log(' Phone dans la réponse:', createdOrder.phone);

      await clearAllCart();

      showNotification('Commande créée avec succès !', 'success');

      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      console.error(' ERREUR CRÉATION COMMANDE ');
      console.error('Error:', error);
      console.error('Response:', error.response?.data);
      
      const errorMsg = error.response?.data?.message || error.message || 'Erreur lors de la création de la commande';
      showNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const total = getCartTotal();

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
        `}
      </style>

      <Navbar userName={user?.username} onLogout={() => {
        localStorage.clear();
        navigate('/login');
      }} />

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
        <h1 style={styles.pageTitle}>
          <ShoppingBag size={32} />
          Finaliser la commande
        </h1>

        <div style={styles.checkoutGrid}>
          <div style={styles.formSection}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <User size={24} color="#8b0000" />
                  Informations de contact
                </h2>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Mail size={16} color="#8b0000" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="exemple@email.com"
                    style={styles.input}
                    required
                    disabled={loading}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#8b0000';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 0, 0, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <small style={styles.helpText}>
                    Utilisé pour les notifications de commande
                  </small>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Phone size={16} color="#8b0000" />
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+212 6XX XX XX XX ou 06XX XX XX XX"
                    style={styles.input}
                    required
                    disabled={loading}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#8b0000';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 0, 0, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <small style={styles.helpText}>
                    Format: +212XXXXXXXXX ou 0XXXXXXXXX
                  </small>
                </div>
              </div>

              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <MapPin size={24} color="#8b0000" />
                  Adresse de livraison
                </h2>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Adresse *</label>
                  <input
                    type="text"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    placeholder="Rue, numéro..."
                    style={styles.input}
                    required
                    disabled={loading}
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

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Ville *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Oujda"
                      style={styles.input}
                      required
                      disabled={loading}
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
                    <label style={styles.label}>Code postal</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="60000"
                      style={styles.input}
                      disabled={loading}
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
                </div>
              </div>

              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <CreditCard size={24} color="#8b0000" />
                  Méthode de paiement
                </h2>

                <div style={styles.paymentMethods}>
                  <label style={{
                    ...styles.paymentOption,
                    ...(formData.paymentMethod === 'cash' && styles.paymentOptionActive)
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <span style={styles.paymentLabel}>Paiement à la livraison (Cash)</span>
                  </label>

                  <label style={{
                    ...styles.paymentOption,
                    ...(formData.paymentMethod === 'card' && styles.paymentOptionActive)
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <span style={styles.paymentLabel}>Carte bancaire</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  ...styles.submitButton,
                  ...(loading && styles.submitButtonDisabled),
                }}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = '#059669';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = '#10b981';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <Loader style={styles.spinner} size={20} />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Confirmer la commande
                  </>
                )}
              </button>
            </form>
          </div>

          <div style={styles.summarySection}>
            <div style={styles.summary}>
              <h2 style={styles.summaryTitle}>Résumé de la commande</h2>

              {formData.email && formData.phone && (
                <div style={styles.confirmationSection}>
                  <h3 style={styles.confirmationTitle}>
                    <CheckCircle size={16} color="#10b981" />
                    Informations de contact
                  </h3>
                  
                  <div style={styles.confirmationItem}>
                    <Mail size={14} color="#8b0000" />
                    <div style={styles.confirmationDetails}>
                      <span style={styles.confirmationLabel}>Email:</span>
                      <span style={styles.confirmationValue}>{formData.email}</span>
                    </div>
                  </div>

                  <div style={styles.confirmationItem}>
                    <Phone size={14} color="#8b0000" />
                    <div style={styles.confirmationDetails}>
                      <span style={styles.confirmationLabel}>Téléphone:</span>
                      <span style={styles.confirmationValue}>{formData.phone}</span>
                    </div>
                  </div>
                </div>
              )}

              <div style={styles.summaryItems}>
                {cart.map((item) => (
                  <div key={item.id} style={styles.summaryItem}>
                    <div style={styles.summaryItemInfo}>
                      <Package size={16} color="#8b0000" />
                      <div style={styles.summaryItemDetails}>
                        <span style={styles.summaryItemName}>{item.product?.name}</span>
                        <div style={styles.summaryItemSeller}>
                          <User size={12} color="#1a1a2e" />
                          <span>{item.product?.userName || 'Vendeur inconnu'}</span>
                        </div>
                      </div>
                    </div>
                    <span style={styles.summaryItemQuantity}>x{item.quantity}</span>
                    <span style={styles.summaryItemPrice}>
                      {((item.product?.price || 0) * item.quantity).toFixed(2)} DH
                    </span>
                  </div>
                ))}
              </div>

              <div style={styles.summaryDivider} />

              <div style={styles.summaryTotals}>
                <div style={styles.summaryRow}>
                  <span>Sous-total:</span>
                  <span>{total.toFixed(2)} DH</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Livraison:</span>
                  <span style={styles.freeShipping}>Gratuite</span>
                </div>
                <div style={styles.summaryDivider} />
                <div style={{ ...styles.summaryRow, ...styles.summaryTotal }}>
                  <span>Total:</span>
                  <span>{total.toFixed(2)} DH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    padding: '30px 20px',
  },
  pageTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '32px',
    color: 'white',
    fontWeight: '800',
    marginBottom: '30px',
  },
  checkoutGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '30px',
  },
  formSection: {
    background: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    border: '2px solid #f0f0f0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '10px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    color: '#1a1a2e',
  },
  helpText: {
    fontSize: '12px',
    color: '#666',
    fontWeight: '500',
    marginTop: '4px',
  },
  paymentMethods: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'white',
  },
  paymentOptionActive: {
    background: '#f5f5f5',
    borderColor: '#8b0000',
  },
  paymentLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a2e',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '16px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  summarySection: {
    height: 'fit-content',
    position: 'sticky',
    top: '100px',
  },
  summary: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    border: '2px solid #f0f0f0',
  },
  summaryTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '20px',
  },
  confirmationSection: {
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '2px solid #10b981',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  confirmationTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '8px',
  },
  confirmationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #bbf7d0',
  },
  confirmationDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  },
  confirmationLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  confirmationValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  summaryItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '20px',
  },
  summaryItem: {
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    alignItems: 'start',
    gap: '12px',
    fontSize: '14px',
    padding: '12px',
    background: '#f5f5f5',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  summaryItemInfo: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    color: '#1a1a2e',
  },
  summaryItemDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  summaryItemName: {
    fontWeight: '700',
    fontSize: '14px',
    color: '#1a1a2e',
  },
  summaryItemSeller: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#1a1a2e',
    fontWeight: '600',
  },
  summaryItemQuantity: {
    color: '#1a1a2e',
    fontWeight: '700',
  },
  summaryItemPrice: {
    fontWeight: '700',
    color: '#8b0000',
  },
  summaryDivider: {
    height: '1px',
    background: '#e0e0e0',
    margin: '16px 0',
  },
  summaryTotals: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#1a1a2e',
    fontWeight: '600',
  },
  freeShipping: {
    color: '#10b981',
    fontWeight: '700',
  },
  summaryTotal: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#1a1a2e',
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
  spinner: {
    animation: 'spin 1s linear infinite',
  },
};

export default Checkout;