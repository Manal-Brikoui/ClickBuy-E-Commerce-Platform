import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authApi';
import { ShoppingBag, User, Lock, AlertCircle, Loader, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Fonction de validation du mot de passe
  const validatePassword = (password) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
    
    return criteria;
  };

  const passwordCriteria = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(' Tentative de connexion...');
    console.log('- Username:', formData.username);

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    // Validation du mot de passe
    if (!isPasswordValid) {
      setError('Le mot de passe ne respecte pas les critères de sécurité');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await login({
        username: formData.username.trim(),
        password: formData.password,
      });

      console.log(' Connexion réussie:', response);

      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.userId);
      localStorage.setItem('userName', response.user.username);

      console.log(' Données stockées dans localStorage');

      navigate('/products');
    } catch (err) {
      console.error(' Erreur de connexion:', err);
      
      const errorMessage = err.response?.data?.message || 
                          'Nom d\'utilisateur ou mot de passe incorrect';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>

      <div style={styles.container}>
        <div style={styles.loginCard}>
          {/* Logo et titre */}
          <div style={styles.header}>
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
                <ShoppingBag size={48} color="white" strokeWidth={2.5} />
              </div>
            </div>
            <h1 style={styles.brandName}>ClickBuy</h1>
            <p style={styles.subtitle}>Connectez-vous à votre compte</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <User size={18} color="#8b0000" />
                Nom d'utilisateur
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Entrez votre nom d'utilisateur"
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

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <Lock size={18} color="#8b0000" />
                Mot de passe
              </label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Entrez votre mot de passe"
                  style={styles.passwordInput}
                  disabled={loading}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#8b0000';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 0, 0, 0.1)';
                    setPasswordFocused(true);
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.boxShadow = 'none';
                    setPasswordFocused(false);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {(passwordFocused || formData.password) && (
                <div style={styles.criteriaBox}>
                  <div style={styles.criteriaItem}>
                    {passwordCriteria.length ? (
                      <CheckCircle size={16} color="#22c55e" />
                    ) : (
                      <XCircle size={16} color="#ef4444" />
                    )}
                    <span style={{
                      ...styles.criteriaText,
                      color: passwordCriteria.length ? '#22c55e' : '#64748b'
                    }}>
                      Au moins 8 caractères
                    </span>
                  </div>
                  
                  <div style={styles.criteriaItem}>
                    {passwordCriteria.uppercase ? (
                      <CheckCircle size={16} color="#22c55e" />
                    ) : (
                      <XCircle size={16} color="#ef4444" />
                    )}
                    <span style={{
                      ...styles.criteriaText,
                      color: passwordCriteria.uppercase ? '#22c55e' : '#64748b'
                    }}>
                      Une lettre majuscule
                    </span>
                  </div>

                  <div style={styles.criteriaItem}>
                    {passwordCriteria.lowercase ? (
                      <CheckCircle size={16} color="#22c55e" />
                    ) : (
                      <XCircle size={16} color="#ef4444" />
                    )}
                    <span style={{
                      ...styles.criteriaText,
                      color: passwordCriteria.lowercase ? '#22c55e' : '#64748b'
                    }}>
                      Une lettre minuscule
                    </span>
                  </div>

                  <div style={styles.criteriaItem}>
                    {passwordCriteria.number ? (
                      <CheckCircle size={16} color="#22c55e" />
                    ) : (
                      <XCircle size={16} color="#ef4444" />
                    )}
                    <span style={{
                      ...styles.criteriaText,
                      color: passwordCriteria.number ? '#22c55e' : '#64748b'
                    }}>
                      Un chiffre
                    </span>
                  </div>

                  <div style={styles.criteriaItem}>
                    {passwordCriteria.special ? (
                      <CheckCircle size={16} color="#22c55e" />
                    ) : (
                      <XCircle size={16} color="#ef4444" />
                    )}
                    <span style={{
                      ...styles.criteriaText,
                      color: passwordCriteria.special ? '#22c55e' : '#64748b'
                    }}>
                      Un caractère spécial (!@#$%^&*...)
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(loading && styles.submitButtonDisabled)
              }}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#6d0000';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 0, 0, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#8b0000';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 0, 0, 0.3)';
                }
              }}
            >
              {loading ? (
                <>
                  <Loader style={styles.spinner} size={20} />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Pas encore de compte ?{' '}
              <Link to="/register" style={styles.link}>
                S'inscrire
              </Link>
            </p>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
  },
  container: {
    width: '100%',
    maxWidth: '480px',
  },
  loginCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '48px 40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'fadeIn 0.6s ease',
    border: '2px solid #f0f0f0',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  logoCircle: {
    width: '110px',
    height: '110px',
    background: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: '0 8px 24px rgba(139, 0, 0, 0.3)',
    border: '4px solid #f5f5f5',
    animation: 'float 3s ease-in-out infinite',
    padding: '15px',
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
    fontSize: '36px',
    fontWeight: '800',
    color: '#1a1a2e',
    margin: '0 0 12px',
    letterSpacing: '-1px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#1a1a2e',
    margin: 0,
    fontWeight: '500',
    opacity: 0.7,
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    background: '#fee2e2',
    color: '#8b0000',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: '14px',
    fontWeight: '600',
    border: '2px solid #fecaca',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
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
    padding: '14px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontWeight: '500',
    color: '#1a1a2e',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  passwordInput: {
    padding: '14px 50px 14px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontWeight: '500',
    color: '#1a1a2e',
    width: '100%',
  },
  eyeButton: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#64748b',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease',
  },
  criteriaBox: {
    background: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '8px',
  },
  criteriaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  criteriaText: {
    fontSize: '13px',
    fontWeight: '600',
  },
  submitButton: {
    padding: '16px',
    background: '#8b0000',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 4px 12px rgba(139, 0, 0, 0.3)',
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center',
    paddingTop: '24px',
    borderTop: '2px solid #f0f0f0',
  },
  footerText: {
    fontSize: '14px',
    color: '#1a1a2e',
    margin: 0,
    fontWeight: '500',
  },
  link: {
    color: '#8b0000',
    fontWeight: '700',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
  },
};

export default Login;