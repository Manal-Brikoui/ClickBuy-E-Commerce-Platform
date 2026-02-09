
import axiosClient from './axiosClient';

export const register = async (registerData) => {
  try {
    console.log('[AUTH]  INSCRIPTION ');
    console.log('[AUTH] Données envoyées:', { username: registerData.username });
    
    const response = await axiosClient.post('/auth/register', {
      username: registerData.username,
      password: registerData.password,
    });
    
    console.log('[AUTH] Inscription réussie');
    console.log('[AUTH] Réponse:', response.data);
    console.log('[AUTH]  FIN INSCRIPTION ');
    
    
    return response.data;
  } catch (error) {
    console.error('[AUTH ERROR]  ERREUR INSCRIPTION');
    console.error('[AUTH ERROR] Erreur:', error);
    console.error('[AUTH ERROR] Message:', error.message);
    console.error('[AUTH ERROR] Response:', error.response?.data);
    console.error('[AUTH ERROR] FIN ERREUR ');
    throw error;
  }
};


export const login = async (loginData) => {
  try {
    console.log('[AUTH]  CONNEXION ');
    console.log('[AUTH] Données envoyées:', { username: loginData.username });
    
    const response = await axiosClient.post('/auth/login', {
      username: loginData.username,
      password: loginData.password,
    });
    
    console.log('[AUTH] Connexion réussie');
    console.log('[AUTH] Réponse:', response.data);
    console.log('[AUTH]  FIN CONNEXION ');
    
  
    return response.data;
  } catch (error) {
    console.error('[AUTH ERROR] ERREUR CONNEXION ');
    console.error('[AUTH ERROR] Erreur:', error);
    console.error('[AUTH ERROR] Message:', error.message);
    console.error('[AUTH ERROR] Response:', error.response?.data);
    console.error('[AUTH ERROR] FIN ERREUR ');
    throw error;
  }
};


export const logout = () => {
  console.log('[AUTH]  DÉCONNEXION ');
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  console.log('[AUTH] LocalStorage nettoyé');
  console.log('[AUTH]  FIN DÉCONNEXION ');
};