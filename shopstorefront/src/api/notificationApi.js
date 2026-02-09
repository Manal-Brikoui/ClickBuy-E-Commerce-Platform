
import axiosClient from './axiosClient';


export const getNotifications = async (unreadOnly = false) => {
  try {
    console.log('[NOTIFICATION] Récupération des notifications...', { unreadOnly });
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token manquant - utilisateur non authentifié');
    }

    const response = await axiosClient.get('/notifications', {
      params: { unreadOnly },
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('[NOTIFICATION] Notifications récupérées:', {
      count: response.data?.length || 0,
      data: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('[NOTIFICATION ERROR] Erreur récupération notifications:', error);
    console.error('[NOTIFICATION ERROR] Response:', error.response?.data);
    throw error;
  }
};


export const getAllNotifications = async (unreadOnly = false) => {
  return getNotifications(unreadOnly);
};


export const getUnreadCount = async () => {
  try {
    console.log('[NOTIFICATION] Récupération du nombre de notifications non lues...');
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token manquant - utilisateur non authentifié');
    }

    const response = await axiosClient.get('/notifications/unread-count', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('[NOTIFICATION] Nombre non lues:', response.data.count);
    
    return response.data.count;
  } catch (error) {
    console.error('[NOTIFICATION ERROR] Erreur récupération compteur:', error);
    console.error('[NOTIFICATION ERROR] Response:', error.response?.data);
    throw error;
  }
};

export const markAsRead = async (notificationId) => {
  try {
    console.log('[NOTIFICATION] Marquage comme lue:', notificationId);
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token manquant - utilisateur non authentifié');
    }

    const response = await axiosClient.put(`/notifications/${notificationId}/read`, null, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('[NOTIFICATION] Notification marquée comme lue:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('[NOTIFICATION ERROR] Erreur marquage comme lue:', error);
    console.error('[NOTIFICATION ERROR] Response:', error.response?.data);
    throw error;
  }
};


export const markAllAsRead = async () => {
  try {
    console.log('[NOTIFICATION] Marquage de toutes les notifications comme lues...');
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token manquant - utilisateur non authentifié');
    }

    const response = await axiosClient.put('/notifications/read-all', null, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('[NOTIFICATION] Toutes les notifications marquées comme lues:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('[NOTIFICATION ERROR] Erreur marquage global:', error);
    console.error('[NOTIFICATION ERROR] Response:', error.response?.data);
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    console.log('[NOTIFICATION] Suppression de la notification:', notificationId);
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token manquant - utilisateur non authentifié');
    }

    const response = await axiosClient.delete(`/notifications/${notificationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('[NOTIFICATION] Notification supprimée:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('[NOTIFICATION ERROR] Erreur suppression notification:', error);
    console.error('[NOTIFICATION ERROR] Response:', error.response?.data);
    throw error;
  }
};