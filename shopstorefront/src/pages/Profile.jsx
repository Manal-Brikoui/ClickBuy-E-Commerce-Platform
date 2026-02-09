import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile, updatePassword } from '../api/profileApi';
import {
  User,
  Lock,
  Save,
  AlertCircle,
  CheckCircle,
  Loader,
  ArrowLeft,
  Eye,
  EyeOff,
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Profile = () => {
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');

  //  mise à jour du username
  const [username, setUsername] = useState(userName || '');
  const [profileLoading, setProfileLoading] = useState(false);

  //  mise à jour du mot de passe
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Visibilité des mots de passe
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Notification
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  if (!token) {
    navigate('/login');
    return null;
  }

  // Fonction pour obtenir les initiales
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Fonction pour obtenir une couleur basée sur le nom
  const getAvatarColor = (name) => {
    if (!name) return '#8b0000';
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      '#8b0000', 
      '#2563eb', 
      '#7c3aed', 
      '#059669', 
      '#ea580c', 
      '#0891b2', 
      '#be123c', 
      '#4f46e5',
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3500);
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  // Mise à jour du username
  const handleUpdateProfile = async () => {
    if (!username.trim()) {
      showNotification('Le nom d\'utilisateur est requis.', 'error');
      return;
    }
    if (username.trim() === userName) {
      showNotification('Le nom d\'utilisateur est déjà le même.', 'error');
      return;
    }

    try {
      setProfileLoading(true);
      await updateProfile(username.trim());

      localStorage.setItem('userName', username.trim());
      showNotification('Nom d\'utilisateur mis à jour avec succès !', 'success');
      
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      const msg = error.response?.data?.message || 'Erreur lors de la mise à jour.';
      showNotification(msg, 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  // Mise à jour du mot de passe
  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showNotification('Tous les champs sont requis.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotification('Les nouveaux mots de passe ne correspondent pas.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showNotification('Le mot de passe doit avoir au moins 6 caractères.', 'error');
      return;
    }

    try {
      setPasswordLoading(true);
      await updatePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showNotification('Mot de passe mis à jour avec succès !', 'success');
    } catch (error) {
      const msg = error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe.';
      showNotification(msg, 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const initials = getInitials(userName);
  const avatarColor = getAvatarColor(userName);

  return (
    <div style={styles.pageWrapper}>
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          input:focus, textarea:focus { 
            border-color: #8b0000 !important; 
            box-shadow: 0 0 0 3px rgba(139,0,0,0.15) !important; 
          }
          button:hover { filter: brightness(1.1); }
        `}
      </style>

      <Navbar
        userName={userName}
        onLogout={handleLogout}
      />

      {notification.show && (
        <div style={{ 
          ...styles.notification, 
          ...(notification.type === 'success' ? styles.notificationSuccess : styles.notificationError) 
        }}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{notification.message}</span>
        </div>
      )}

      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Retour
        </button>

        <div style={styles.profileHeader}>
          <div 
            style={{
              ...styles.avatarInitials,
              background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}dd)`
            }}
          >
            {initials}
          </div>
          <h2 style={styles.profileName}>{userName || 'Utilisateur'}</h2>
          <p style={styles.profileSubtitle}>Gérez vos informations personnelles</p>
        </div>

        <div style={styles.cardsWrapper}>
          {/* Carte: Username */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardHeaderIcon}>
                <User size={22} color="#8b0000" />
              </div>
              <div>
                <h3 style={styles.cardTitle}>Informations personnelles</h3>
                <p style={styles.cardSubtitle}>Modifier votre nom d'utilisateur</p>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Nom d'utilisateur</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Votre nom d'utilisateur"
                style={styles.input}
                disabled={profileLoading}
              />
             
            </div>

            <button
              style={{ ...styles.saveButton, ...(profileLoading && styles.buttonDisabled) }}
              onClick={handleUpdateProfile}
              disabled={profileLoading}
            >
              {profileLoading ? (
                <><Loader size={18} style={styles.spinner} /> Sauvegarde...</>
              ) : (
                <><Save size={18} /> Sauvegarder</>
              )}
            </button>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardHeaderIcon}>
                <Lock size={22} color="#8b0000" />
              </div>
              <div>
                <h3 style={styles.cardTitle}>Sécurité</h3>
                <p style={styles.cardSubtitle}>Changer votre mot de passe</p>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Mot de passe actuel</label>
              <div style={styles.inputPasswordWrapper}>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  style={styles.inputPassword}
                  disabled={passwordLoading}
                />
                <button style={styles.eyeButton} onClick={() => setShowCurrent(!showCurrent)} type="button">
                  {showCurrent ? <EyeOff size={18} color="#999" /> : <Eye size={18} color="#999" />}
                </button>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Nouveau mot de passe</label>
              <div style={styles.inputPasswordWrapper}>
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  style={styles.inputPassword}
                  disabled={passwordLoading}
                />
                <button style={styles.eyeButton} onClick={() => setShowNew(!showNew)} type="button">
                  {showNew ? <EyeOff size={18} color="#999" /> : <Eye size={18} color="#999" />}
                </button>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Confirmer le nouveau mot de passe</label>
              <div style={styles.inputPasswordWrapper}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={styles.inputPassword}
                  disabled={passwordLoading}
                />
                <button style={styles.eyeButton} onClick={() => setShowConfirm(!showConfirm)} type="button">
                  {showConfirm ? <EyeOff size={18} color="#999" /> : <Eye size={18} color="#999" />}
                </button>
              </div>
            </div>

            {newPassword && (
              <div style={styles.strengthWrapper}>
                <div style={styles.strengthBar}>
                  <div style={{
                    ...styles.strengthFill,
                    width: newPassword.length >= 10 ? '100%' : newPassword.length >= 6 ? '60%' : '30%',
                    background: newPassword.length >= 10 ? '#10b981' : newPassword.length >= 6 ? '#f59e0b' : '#ef4444',
                  }} />
                </div>
                <span style={{
                  ...styles.strengthText,
                  color: newPassword.length >= 10 ? '#10b981' : newPassword.length >= 6 ? '#f59e0b' : '#ef4444',
                }}>
                  {newPassword.length >= 10 ? 'Fort' : newPassword.length >= 6 ? 'Moyen' : 'Faible'}
                </span>
              </div>
            )}

            <button
              style={{ ...styles.saveButton, ...(passwordLoading && styles.buttonDisabled) }}
              onClick={handleUpdatePassword}
              disabled={passwordLoading}
            >
              {passwordLoading ? (
                <><Loader size={18} style={styles.spinner} /> Mise à jour...</>
              ) : (
                <><Lock size={18} /> Mettre à jour le mot de passe</>
              )}
            </button>
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
    maxWidth: '800px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '24px',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'all 0.2s',
    backdropFilter: 'blur(10px)',
  },
  profileHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '36px',
    animation: 'fadeIn 0.5s ease',
  },
  avatarInitials: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    fontWeight: 'bold',
    color: 'white',
    border: '4px solid white',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
    animation: 'pulse 2s ease-in-out infinite',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  profileName: {
    color: 'white',
    fontSize: '28px',
    fontWeight: '800',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  profileSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '15px',
    fontWeight: '500',
    margin: 0,
  },
  cardsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    animation: 'fadeIn 0.5s ease',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '28px',
  },
  cardHeaderIcon: {
    width: '52px',
    height: '52px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(139, 0, 0, 0.2)',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#1a1a2e',
    margin: '0 0 6px 0',
  },
  cardSubtitle: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '15px',
    color: '#1a1a2e',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    background: '#fafafa',
    fontWeight: '500',
  },
  hint: {
    fontSize: '13px',
    color: '#666',
    marginTop: '8px',
    fontStyle: 'italic',
  },
  inputPasswordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputPassword: {
    width: '100%',
    padding: '14px 48px 14px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '15px',
    color: '#1a1a2e',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    background: '#fafafa',
    fontWeight: '500',
  },
  eyeButton: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  strengthWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    marginTop: '-8px',
  },
  strengthBar: {
    flex: 1,
    height: '6px',
    background: '#e5e7eb',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'all 0.3s ease',
  },
  strengthText: {
    fontSize: '13px',
    fontWeight: '700',
    minWidth: '50px',
  },
  saveButton: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #8b0000, #6d0000)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    marginTop: '8px',
    boxShadow: '0 4px 12px rgba(139, 0, 0, 0.3)',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
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
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
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
};

export default Profile;