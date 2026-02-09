import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, User, LogOut, ClipboardList } from 'lucide-react';
import { useCart } from '../context/CartContext';
import NotificationBell from './NotificationBell';

const Navbar = ({ userName, onLogout }) => {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(userName);

  return (
    <nav style={styles.navbar}>
      <div style={styles.navbarContent}>
        <div style={styles.navbarLeft}>
          <div 
            style={styles.logoContainer} 
            onClick={() => navigate('/products')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#8b0000';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.querySelector('h1').style.color = '#8b0000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.querySelector('h1').style.color = '#1a1a2e';
            }}
          >
            <img 
              src="/images/logo.png" 
              alt="ClickBuy Logo" 
              style={styles.logoImage}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <h1 style={styles.navbarTitle}>ClickBuy</h1>
          </div>
        </div>

        <div style={styles.navbarRight}>
          <button 
            style={styles.navButton} 
            onClick={() => navigate('/products')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = '#8b0000';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Package size={20} />
            <span>Produits</span>
          </button>

          <button 
            style={styles.navButton} 
            onClick={() => navigate('/cart')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = '#8b0000';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={styles.iconWrapper}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span style={styles.badge}>{cartCount}</span>
              )}
            </div>
            <span>Panier</span>
          </button>

          <button 
            style={styles.navButton} 
            onClick={() => navigate('/orders')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = '#8b0000';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <ClipboardList size={20} />
            <span>Commandes</span>
          </button>

          <NotificationBell />

          <button 
            style={styles.userInfoButton} 
            onClick={() => navigate('/profile')}
          >
            <div 
              style={styles.userInfo}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderColor = '#8b0000';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={styles.avatarInitials}>
                {initials}
              </div>
              <span style={styles.userName}>{userName || 'Utilisateur'}</span>
            </div>
          </button>

          <button 
            style={styles.logoutButton} 
            onClick={onLogout}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#a00000';
              e.currentTarget.style.borderColor = '#a00000';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#8b0000';
              e.currentTarget.style.borderColor = '#8b0000';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navbarContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navbarLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    background: 'white', 
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '2px solid white', 
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  logoImage: {
    width: '32px',
    height: '32px',
    objectFit: 'contain',
  },
  navbarTitle: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#1a1a2e', 
    margin: 0,
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
  },
  navbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: '2px solid transparent',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  iconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    background: '#8b0000',
    color: 'white',
    fontSize: '11px',
    fontWeight: '800',
    borderRadius: '12px',
    padding: '3px 7px',
    minWidth: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(139, 0, 0, 0.4)',
  },
  userInfoButton: {
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '2px solid transparent',
  },
  avatarInitials: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px',
    fontWeight: '800',
    color: 'white',
    background: '#8b0000',
    border: '2px solid white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'white',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: '#8b0000',
    color: 'white',
    border: '2px solid #8b0000',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

export default Navbar;