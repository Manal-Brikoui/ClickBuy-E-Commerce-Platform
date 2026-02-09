import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  Shield, 
  Star,
  Zap,
  Heart,
  Award,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>

      <div style={styles.hero}>
        <div style={styles.heroOverlay} />
        
        <div style={styles.heroContent}>
          <div style={styles.logoContainer}>
            <div style={styles.logoCircle}>
              <img 
                src="/images/logo.png" 
                alt="ClickBuy Logo" 
                style={styles.logoImage}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{ ...styles.logoFallback, display: 'none' }}>
                <ShoppingBag size={80} color="white" strokeWidth={2.5} />
              </div>
            </div>
            <h1 style={styles.brandName}>ClickBuy</h1>
            <div style={styles.brandTagline}>
              <Star size={16} color="#fbbf24" fill="#fbbf24" />
              <span>Votre Marketplace de Confiance</span>
              <Star size={16} color="#fbbf24" fill="#fbbf24" />
            </div>
          </div>

          <p style={styles.heroDescription}>
            Découvrez des milliers de produits, vendez facilement et rejoignez une communauté passionnée d'acheteurs et de vendeurs
          </p>
          
          <div style={styles.buttonGroup}>
            <button 
              style={styles.primaryButton}
              onClick={() => navigate('/register')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 0, 0, 0.3)';
              }}
            >
              Commencer Maintenant
              <ArrowRight size={20} />
            </button>
            
            <button 
              style={styles.secondaryButton}
              onClick={() => navigate('/login')}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#8b0000';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Se Connecter
            </button>
          </div>

          <div style={styles.statsContainer}>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>10K+</div>
              <div style={styles.statLabel}>Produits</div>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <div style={styles.statNumber}>5K+</div>
              <div style={styles.statLabel}>Utilisateurs</div>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <div style={styles.statNumber}>98%</div>
              <div style={styles.statLabel}>Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Pourquoi Choisir ClickBuy ?</h2>
          <p style={styles.sectionSubtitle}>
            Une plateforme conçue pour simplifier vos achats et vos ventes
          </p>
        </div>

        <div style={styles.featuresGrid}>
          <div 
            style={styles.featureCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 0, 0, 0.15)';
              e.currentTarget.style.borderColor = '#8b0000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#f0f0f0';
            }}
          >
            <div style={styles.featureIcon}>
              <Package size={40} color="#8b0000" strokeWidth={2} />
            </div>
            <h3 style={styles.featureTitle}>Large Sélection</h3>
            <p style={styles.featureText}>
              Des milliers de produits dans toutes les catégories pour répondre à tous vos besoins
            </p>
          </div>
          
          <div 
            style={styles.featureCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 0, 0, 0.15)';
              e.currentTarget.style.borderColor = '#8b0000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#f0f0f0';
            }}
          >
            <div style={styles.featureIcon}>
              <Zap size={40} color="#8b0000" strokeWidth={2} />
            </div>
            <h3 style={styles.featureTitle}>Transactions Rapides</h3>
            <p style={styles.featureText}>
              Processus d'achat simplifié et livraison rapide pour une expérience fluide
            </p>
          </div>
          
          <div 
            style={styles.featureCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 0, 0, 0.15)';
              e.currentTarget.style.borderColor = '#8b0000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#f0f0f0';
            }}
          >
            <div style={styles.featureIcon}>
              <TrendingUp size={40} color="#8b0000" strokeWidth={2} />
            </div>
            <h3 style={styles.featureTitle}>Vendez Facilement</h3>
            <p style={styles.featureText}>
              Créez votre boutique en quelques clics et commencez à vendre immédiatement
            </p>
          </div>
          
          <div 
            style={styles.featureCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 0, 0, 0.15)';
              e.currentTarget.style.borderColor = '#8b0000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#f0f0f0';
            }}
          >
            <div style={styles.featureIcon}>
              <Shield size={40} color="#8b0000" strokeWidth={2} />
            </div>
            <h3 style={styles.featureTitle}>Achats Sécurisés</h3>
            <p style={styles.featureText}>
              Protection complète des acheteurs et transactions 100% sécurisées
            </p>
          </div>

          <div 
            style={styles.featureCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 0, 0, 0.15)';
              e.currentTarget.style.borderColor = '#8b0000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#f0f0f0';
            }}
          >
            <div style={styles.featureIcon}>
              <Heart size={40} color="#8b0000" strokeWidth={2} />
            </div>
            <h3 style={styles.featureTitle}>Service Client</h3>
            <p style={styles.featureText}>
              Support disponible 24/7 pour répondre à toutes vos questions
            </p>
          </div>

          <div 
            style={styles.featureCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 0, 0, 0.15)';
              e.currentTarget.style.borderColor = '#8b0000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#f0f0f0';
            }}
          >
            <div style={styles.featureIcon}>
              <Award size={40} color="#8b0000" strokeWidth={2} />
            </div>
            <h3 style={styles.featureTitle}>Qualité Garantie</h3>
            <p style={styles.featureText}>
              Produits vérifiés et vendeurs certifiés pour votre tranquillité d'esprit
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Prêt à Commencer ?</h2>
          <p style={styles.ctaText}>
            Rejoignez des milliers d'utilisateurs satisfaits et découvrez une nouvelle façon de faire du shopping
          </p>
          <button 
            style={styles.ctaButton}
            onClick={() => navigate('/register')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 255, 255, 0.2)';
            }}
          >
            Créer un Compte Gratuit
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerBrand}>
            <img 
              src="/images/logo.png" 
              alt="ClickBuy Logo" 
              style={styles.footerLogo}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'inline-block';
              }}
            />
            <ShoppingBag size={32} color="#8b0000" style={{ display: 'none' }} />
            <span style={styles.footerBrandName}>ClickBuy</span>
          </div>
          <p style={styles.footerText}>© 2026 ClickBuy - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  hero: {
    position: 'relative',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)',
    padding: '100px 20px 80px',
    textAlign: 'center',
    color: 'white',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(139, 0, 0, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  heroContent: {
    position: 'relative',
    maxWidth: '900px',
    margin: '0 auto',
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: '40px',
    animation: 'fadeInUp 0.8s ease',
  },
  logoCircle: {
    width: '180px',
    height: '180px',
    background: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: '0 20px 60px rgba(139, 0, 0, 0.4)',
    border: '6px solid rgba(139, 0, 0, 0.2)',
    animation: 'float 3s ease-in-out infinite',
    padding: '20px',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  logoFallback: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #8b0000 0%, #6d0000 100%)',
    borderRadius: '50%',
  },
  brandName: {
    fontSize: '64px',
    fontWeight: '800',
    margin: '0 0 16px',
    color: 'white',
    letterSpacing: '-2px',
    textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  brandTagline: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    fontSize: '18px',
    color: '#fbbf24',
    fontWeight: '600',
  },
  heroDescription: {
    fontSize: '20px',
    lineHeight: '1.8',
    marginBottom: '48px',
    color: 'rgba(255, 255, 255, 0.9)',
    maxWidth: '700px',
    margin: '0 auto 48px',
    fontWeight: '500',
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '60px',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '18px 40px',
    fontSize: '18px',
    fontWeight: '700',
    background: '#8b0000',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(139, 0, 0, 0.3)',
  },
  secondaryButton: {
    padding: '18px 40px',
    fontSize: '18px',
    fontWeight: '700',
    background: 'transparent',
    color: 'white',
    border: '2px solid white',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '40px',
    flexWrap: 'wrap',
    padding: '40px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#8b0000',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  statDivider: {
    width: '1px',
    height: '60px',
    background: 'rgba(255, 255, 255, 0.2)',
  },
  featuresSection: {
    padding: '100px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  sectionTitle: {
    fontSize: '42px',
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: '16px',
    letterSpacing: '-1px',
  },
  sectionSubtitle: {
    fontSize: '18px',
    color: '#1a1a2e',
    fontWeight: '500',
    opacity: 0.8,
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '32px',
  },
  featureCard: {
    background: 'white',
    padding: '40px 32px',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    border: '2px solid #f0f0f0',
  },
  featureIcon: {
    width: '80px',
    height: '80px',
    background: '#f5f5f5',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    border: '2px solid #e0e0e0',
  },
  featureTitle: {
    fontSize: '22px',
    margin: '0 0 16px',
    color: '#1a1a2e',
    fontWeight: '700',
  },
  featureText: {
    fontSize: '15px',
    color: '#1a1a2e',
    lineHeight: '1.8',
    fontWeight: '500',
    opacity: 0.8,
  },
  ctaSection: {
    background: 'linear-gradient(135deg, #8b0000 0%, #6d0000 100%)',
    padding: '80px 20px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  ctaContent: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '700px',
    margin: '0 auto',
  },
  ctaTitle: {
    fontSize: '42px',
    fontWeight: '800',
    color: 'white',
    marginBottom: '20px',
    letterSpacing: '-1px',
  },
  ctaText: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '40px',
    lineHeight: '1.8',
    fontWeight: '500',
  },
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px 48px',
    fontSize: '18px',
    fontWeight: '700',
    background: 'white',
    color: '#8b0000',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(255, 255, 255, 0.2)',
  },
  footer: {
    background: '#1a1a2e',
    padding: '40px 20px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  footerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  footerLogo: {
    width: '40px',
    height: '40px',
    objectFit: 'contain',
  },
  footerBrandName: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default Home;