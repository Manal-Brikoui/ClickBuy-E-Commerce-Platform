import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5017/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('[HTTP REQUEST]', {
      method: config.method?.toUpperCase(),
      url: config.url,
      hasToken: !!token,
    });
    
    return config;
  },
  (error) => {
    console.error('[HTTP ERROR] Erreur dans l\'intercepteur de requête:', error);
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    console.log('[HTTP RESPONSE]', {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, statusText, data } = error.response;
      const url = error.config?.url;

      console.error('[HTTP ERROR]', {
        status,
        statusText,
        url,
        message: data?.message || error.message,
      });

      if (status === 401) {
        console.warn('[AUTH]  Session expirée ou token invalide');
        
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        
        if (window.location.pathname !== '/login') {
          console.warn('[AUTH]  Redirection vers /login');
          window.location.href = '/login';
        }
      }

      if (status === 500) {
        console.error('[SERVER ERROR]  Erreur interne du serveur');
        
        if (data?.includes?.('No authenticationScheme')) {
          console.error('[SERVER ERROR]  Le backend .NET n\'est pas configuré pour l\'authentification JWT');
          console.error('[SERVER ERROR]  Vérifiez la configuration dans Program.cs ou Startup.cs');
        }
      }

      if (status === 403) {
        console.warn('[AUTH]  Accès refusé - Permissions insuffisantes');
      }

      if (status === 404) {
        console.warn('[HTTP]  Ressource introuvable:', url);
      }

    } else if (error.request) {
      console.error('[NETWORK ERROR] [X] Aucune réponse du serveur');
      console.error('[NETWORK ERROR] Le backend est-il démarré sur http://localhost:5017 ?');
    } else {
      console.error('[HTTP ERROR]  Erreur de configuration:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;