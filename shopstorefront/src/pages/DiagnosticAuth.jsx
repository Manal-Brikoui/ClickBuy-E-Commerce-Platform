import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { testConnection } from '../api/productApi';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  RefreshCw,
  Database,
  Server,
  Key,
  User,
} from 'lucide-react';

const DiagnosticAuth = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [apiStatus, setApiStatus] = useState({ status: 'loading', message: '' });
  const [localStorageData, setLocalStorageData] = useState({});

  useEffect(() => {
    checkAPIConnection();
    loadLocalStorage();
  }, []);

  const checkAPIConnection = async () => {
    try {
      const response = await testConnection();
      setApiStatus({ status: 'success', message: 'API connectée' });
    } catch (error) {
      setApiStatus({ 
        status: 'error', 
        message: `Erreur API: ${error.message}` 
      });
    }
  };

  const loadLocalStorage = () => {
    setLocalStorageData({
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      userName: localStorage.getItem('userName'),
    });
  };

  const handleRefresh = () => {
    checkAPIConnection();
    loadLocalStorage();
  };

  const handleClearLocalStorage = () => {
    if (window.confirm('Voulez-vous vraiment vider le localStorage ?')) {
      localStorage.clear();
      loadLocalStorage();
      window.location.reload();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <AlertCircle size={32} />
          Diagnostic d'Authentification
        </h1>
        <button 
          style={styles.refreshButton}
          onClick={handleRefresh}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#8b0000';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          }}
        >
          <RefreshCw size={18} />
          Actualiser
        </button>
      </div>

      <div style={styles.grid}>
        <div 
          style={styles.card}
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
          <div style={styles.cardHeader}>
            <Server size={24} color="#8b0000" />
            <h2 style={styles.cardTitle}>Connexion API</h2>
          </div>
          <div style={styles.cardContent}>
            <div style={styles.statusRow}>
              {apiStatus.status === 'loading' && (
                <>
                  <Info size={20} color="#8b0000" />
                  <span>Vérification en cours...</span>
                </>
              )}
              {apiStatus.status === 'success' && (
                <>
                  <CheckCircle size={20} color="#10b981" />
                  <span style={styles.successText}>{apiStatus.message}</span>
                </>
              )}
              {apiStatus.status === 'error' && (
                <>
                  <XCircle size={20} color="#8b0000" />
                  <span style={styles.errorText}>{apiStatus.message}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div 
          style={styles.card}
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
          <div style={styles.cardHeader}>
            <User size={24} color="#8b0000" />
            <h2 style={styles.cardTitle}>Context Auth</h2>
          </div>
          <div style={styles.cardContent}>
            <div style={styles.infoRow}>
              <strong>Authentifié:</strong>
              {isAuthenticated() ? (
                <CheckCircle size={18} color="#10b981" />
              ) : (
                <XCircle size={18} color="#8b0000" />
              )}
            </div>
            <div style={styles.infoRow}>
              <strong>Username:</strong>
              <span>{user?.username || 'N/A'}</span>
            </div>
            <div style={styles.infoRow}>
              <strong>User ID:</strong>
              <span>{user?.userId || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div 
          style={styles.card}
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
          <div style={styles.cardHeader}>
            <Key size={24} color="#8b0000" />
            <h2 style={styles.cardTitle}>Token JWT</h2>
          </div>
          <div style={styles.cardContent}>
            {token ? (
              <>
                <div style={styles.infoRow}>
                  <CheckCircle size={18} color="#10b981" />
                  <span style={styles.successText}>Token présent</span>
                </div>
                <div style={styles.tokenPreview}>
                  {token.substring(0, 50)}...
                </div>
              </>
            ) : (
              <div style={styles.infoRow}>
                <XCircle size={18} color="#8b0000" />
                <span style={styles.errorText}>Aucun token</span>
              </div>
            )}
          </div>
        </div>

        <div 
          style={styles.card}
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
          <div style={styles.cardHeader}>
            <Database size={24} color="#8b0000" />
            <h2 style={styles.cardTitle}>localStorage</h2>
          </div>
          <div style={styles.cardContent}>
            {Object.entries(localStorageData).map(([key, value]) => (
              <div key={key} style={styles.infoRow}>
                <strong>{key}:</strong>
                <span style={styles.storageValue}>
                  {value ? (
                    key === 'token' ? `${value.substring(0, 20)}...` : value
                  ) : (
                    <span style={styles.errorText}>Vide</span>
                  )}
                </span>
              </div>
            ))}
            <button
              style={styles.clearButton}
              onClick={handleClearLocalStorage}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#8b0000';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
              }}
            >
              Vider localStorage
            </button>
          </div>
        </div>
      </div>

      <div style={styles.recommendations}>
        <h3 style={styles.recommendationsTitle}>
          <Info size={20} color="#8b0000" />
          Recommandations
        </h3>
        
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '32px',
    color: 'white',
    fontWeight: '800',
    margin: 0,
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'white',
    color: '#8b0000',
    border: '2px solid #8b0000',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  grid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '30px',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    border: '2px solid #f0f0f0',
    transition: 'all 0.3s ease',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '16px',
    padding: '12px',
    background: '#f5f5f5',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    fontSize: '14px',
    color: '#1a1a2e',
    padding: '12px',
    background: '#f5f5f5',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    fontWeight: '600',
  },
  successText: {
    color: '#10b981',
    fontWeight: '700',
  },
  errorText: {
    color: '#8b0000',
    fontWeight: '700',
  },
  tokenPreview: {
    padding: '12px',
    background: '#f5f5f5',
    borderRadius: '8px',
    fontSize: '12px',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
    color: '#1a1a2e',
    border: '2px solid #e0e0e0',
  },
  storageValue: {
    fontSize: '13px',
    color: '#1a1a2e',
    fontWeight: '600',
  },
  clearButton: {
    marginTop: '12px',
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
  },
  recommendations: {
    maxWidth: '1200px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    border: '2px solid #f0f0f0',
  },
  recommendationsTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '16px',
  },
  recommendationsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
};

export default DiagnosticAuth;