import axiosClient from './axiosClient';

export const updateProfile = async (username) => {
  try {
    console.log('[PROFILE]  MISE À JOUR PROFIL ');
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token manquant. Veuillez vous reconnecter.');
    }

    console.log('[PROFILE] Token présent:', !!token);
    console.log('[PROFILE] Nouveau username:', username);

    const response = await axiosClient.put('/auth/profile', 
      { username: username },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    console.log('[PROFILE] Profil mis à jour avec succès');
    console.log('[PROFILE] Réponse:', response.data);
    console.log('[PROFILE] FIN MISE À JOUR ');
    
    return response.data;
  } catch (error) {
    console.error('[PROFILE ERROR] ERREUR MISE À JOUR ');
    console.error('[PROFILE ERROR] Erreur complète:', error);
    console.error('[PROFILE ERROR] Message:', error.message);
    console.error('[PROFILE ERROR] Response status:', error.response?.status);
    console.error('[PROFILE ERROR] Response data:', error.response?.data);
    console.error('[PROFILE ERROR]  FIN ERREUR ');
    throw error;
  }
};


export const updatePassword = async (passwordData) => {
  try {
    console.log('[PASSWORD] MISE À JOUR MOT DE PASSE ');
    
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token manquant. Veuillez vous reconnecter.');
    }

    console.log('[PASSWORD] Token présent:', !!token);
    console.log('[PASSWORD] Current password fourni:', !!passwordData.currentPassword);
    console.log('[PASSWORD] New password fourni:', !!passwordData.newPassword);
    console.log('[PASSWORD] Confirm password fourni:', !!passwordData.confirmPassword);
    console.log('[PASSWORD] Passwords match:', passwordData.newPassword === passwordData.confirmPassword);

    // Validation côté client
    if (!passwordData.currentPassword) {
      throw new Error('Le mot de passe actuel est requis');
    }

    if (!passwordData.newPassword) {
      throw new Error('Le nouveau mot de passe est requis');
    }

    if (!passwordData.confirmPassword) {
      throw new Error('La confirmation du mot de passe est requise');
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      throw new Error('Les nouveaux mots de passe ne correspondent pas');
    }

    if (passwordData.newPassword.length < 6) {
      throw new Error('Le nouveau mot de passe doit avoir au moins 6 caractères');
    }

    const response = await axiosClient.put('/auth/password', 
      {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    console.log('[PASSWORD] Mot de passe mis à jour avec succès');
    console.log('[PASSWORD] Réponse:', response.data);
    console.log('[PASSWORD]  FIN MISE À JOUR ');
    
    return response.data;
  } catch (error) {
    console.error('[PASSWORD ERROR] ERREUR MISE À JOUR ');
    console.error('[PASSWORD ERROR] Erreur complète:', error);
    console.error('[PASSWORD ERROR] Message:', error.message);
    console.error('[PASSWORD ERROR] Response status:', error.response?.status);
    console.error('[PASSWORD ERROR] Response data:', error.response?.data);
    console.error('[PASSWORD ERROR]  FIN ERREUR ');
    throw error;
  }
};