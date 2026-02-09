import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.mainSection}>
          <div style={styles.column}>
            <div style={styles.logoSection}>
              <img 
                src="/images/logo.png" 
                alt="ClickBuy Logo" 
                style={styles.logoImage}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <h3 style={styles.logoText}>ClickBuy</h3>
            </div>
            <p style={styles.description}>
              Votre plateforme e-commerce de confiance pour tous vos achats en ligne.
              Qualité, rapidité et service client au rendez-vous.
            </p>
            <div style={styles.socialLinks}>
              <a 
                href="#" 
                style={styles.socialIcon}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#8b0000';
                  e.currentTarget.style.borderColor = 'white';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                style={styles.socialIcon}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#8b0000';
                  e.currentTarget.style.borderColor = 'white';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                style={styles.socialIcon}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#8b0000';
                  e.currentTarget.style.borderColor = 'white';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                style={styles.socialIcon}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#8b0000';
                  e.currentTarget.style.borderColor = 'white';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div style={styles.column}>
            <h4 style={styles.columnTitle}>Liens rapides</h4>
            <ul style={styles.linkList}>
              <li style={styles.linkItem}>
                <a 
                  href="/" 
                  style={styles.link}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#8b0000';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  Accueil
                </a>
              </li>
              <li style={styles.linkItem}>
                <a 
                  href="/products" 
                  style={styles.link}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#8b0000';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  Produits
                </a>
              </li>
              <li style={styles.linkItem}>
                <a 
                  href="/cart" 
                  style={styles.link}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#8b0000';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  Panier
                </a>
              </li>
              <li style={styles.linkItem}>
                <a 
                  href="/orders" 
                  style={styles.link}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#8b0000';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  Commandes
                </a>
              </li>
            </ul>
          </div>

          <div style={styles.column}>
            <h4 style={styles.columnTitle}>Service client</h4>
            <ul style={styles.linkList}>
              <li style={styles.linkItem}>
                <a 
                  href="#" 
                  style={styles.link}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#8b0000';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  FAQ
                </a>
              </li>
              <li style={styles.linkItem}>
                <a 
                  href="#" 
                  style={styles.link}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#8b0000';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  Livraison
                </a>
              </li>
              <li style={styles.linkItem}>
                <a 
                  href="#" 
                  style={styles.link}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#8b0000';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  Retours
                </a>
              </li>
              <li style={styles.linkItem}>
                <a 
                  href="#" 
                  style={styles.link}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#8b0000';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div style={styles.column}>
            <h4 style={styles.columnTitle}>Contact</h4>
            <div style={styles.contactInfo}>
              <div style={styles.contactItem}>
                <Mail size={18} color="#8b0000" />
                <span>contact@clickbuy.ma</span>
              </div>
              <div style={styles.contactItem}>
                <Phone size={18} color="#8b0000" />
                <span>+212 6XX XX XX XX</span>
              </div>
              <div style={styles.contactItem}>
                <MapPin size={18} color="#8b0000" />
                <span>Oujda, Maroc</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.bottomBar}>
          <p style={styles.copyright}>
            © {currentYear} ClickBuy. Tous droits réservés. Fait avec <Heart size={14} color="#8b0000" style={{ display: 'inline-block' }} /> au Maroc
          </p>
          <div style={styles.legalLinks}>
            <a 
              href="#" 
              style={styles.legalLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#8b0000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              }}
            >
              Conditions d'utilisation
            </a>
            <span style={styles.separator}>•</span>
            <a 
              href="#" 
              style={styles.legalLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#8b0000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              }}
            >
              Politique de confidentialité
            </a>
            <span style={styles.separator}>•</span>
            <a 
              href="#" 
              style={styles.legalLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#8b0000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              }}
            >
              Mentions légales
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white',
    padding: '60px 20px 20px',
    marginTop: '60px',
    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.2)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  mainSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginBottom: '40px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  logoImage: {
    width: '32px',
    height: '32px',
    objectFit: 'contain',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#8b0000',
    margin: 0,
  },
  description: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.6,
    margin: 0,
  },
  socialLinks: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  socialIcon: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    color: 'white',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    textDecoration: 'none',
    border: '2px solid transparent',
  },
  columnTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '8px',
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  linkItem: {
    margin: 0,
  },
  link: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'inline-block',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
    padding: '8px 12px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  bottomBar: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  copyright: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legalLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  legalLink: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.6)',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  separator: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: '13px',
  },
};

export default Footer;