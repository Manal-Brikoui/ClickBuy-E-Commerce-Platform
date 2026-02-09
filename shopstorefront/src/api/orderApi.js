
import axiosClient from './axiosClient';

export const createOrder = async (orderData) => {
  try {
    console.log('[ORDER] CRÉATION DE COMMANDE ');
    console.log('[ORDER] Données envoyées:', orderData);
    
    const token = localStorage.getItem('token');
    console.log('[ORDER] Token présent:', !!token);
    
    if (!token) {
      throw new Error('Pas de token - utilisateur non authentifié');
    }

    //  Validation des données
    if (!orderData.userId) {
      throw new Error('userId est requis');
    }
    
    // Validation Email
    if (!orderData.email) {
      throw new Error('email est requis');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(orderData.email)) {
      throw new Error('Format d\'email invalide');
    }
    
    //  Validation Phone
    if (!orderData.phone) {
      throw new Error('phone est requis');
    }
    
    const phoneRegex = /^(\+212|0)[0-9]{9}$/;
    if (!phoneRegex.test(orderData.phone)) {
      throw new Error('Format de téléphone invalide (format marocain requis: +212XXXXXXXXX ou 0XXXXXXXXX)');
    }
    
    // Validation des items
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new Error('items est requis et doit contenir au moins un article');
    }

    // Valider chaque item
    orderData.items.forEach((item, index) => {
      if (!item.productId) {
        throw new Error(`Item ${index}: productId est requis`);
      }
      if (!item.quantity || item.quantity < 1) {
        throw new Error(`Item ${index}: quantity doit être >= 1`);
      }
    });

    console.log('[ORDER]  Validation OK');
    console.log('[ORDER]  Email:', orderData.email);
    console.log('[ORDER]  Phone:', orderData.phone);
    console.log('[ORDER] Envoi vers: /orders/create');
    
    const response = await axiosClient.post('/orders/create', orderData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    console.log('[ORDER] Réponse reçue:');
    console.log('[ORDER]  Status:', response.status);
    console.log('[ORDER]  Data:', response.data);
    console.log('[ORDER]  Email dans réponse:', response.data.email);
    console.log('[ORDER]  Phone dans réponse:', response.data.phone);
    console.log('[ORDER]  FIN CRÉATION ');
    
    return response.data;
  } catch (error) {
    console.error('[ORDER ERROR]  ERREUR CRÉATION ');
    console.error('[ORDER ERROR]  Error:', error);
    console.error('[ORDER ERROR]  Message:', error.message);
    console.error('[ORDER ERROR]  Response:', error.response?.data);
    console.error('[ORDER ERROR]  Status:', error.response?.status);
    console.error('[ORDER ERROR] FIN ERREUR ');
    throw error;
  }
};

export const getOrders = async () => {
  try {
    console.log('[ORDER]  RÉCUPÉRATION MES COMMANDES (ACHETEUR) ');
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Pas de token - utilisateur non authentifié');
    }
    
    const response = await axiosClient.get('/orders', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('[ORDER]  MES commandes récupérées (je suis l\'acheteur):', {
      count: response.data?.length || 0,
      data: response.data
    });
 
    if (response.data && response.data.length > 0) {
      const firstOrder = response.data[0];
      console.log('[ORDER]  Email présent:', !!firstOrder.email);
      console.log('[ORDER]  Phone présent:', !!firstOrder.phone);
    }
    
    console.log('[ORDER]  FIN RÉCUPÉRATION ');
    
    return response.data;
  } catch (error) {
    console.error('[ORDER ERROR] Erreur récupération MES commandes:', error);
    console.error('[ORDER ERROR] Response:', error.response?.data);
    throw error;
  }
};


export const getReceivedOrders = async () => {
  try {
    console.log('[ORDER]  RÉCUPÉRATION COMMANDES REÇUES (VENDEUR) ');
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Pas de token - utilisateur non authentifié');
    }
    
    const response = await axiosClient.get('/orders/received', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('[ORDER]  Commandes REÇUES récupérées (je suis le vendeur):', {
      count: response.data?.length || 0,
      data: response.data
    });
    
    // Vérifier que les commandes contiennent Email et Phone
    if (response.data && response.data.length > 0) {
      const firstOrder = response.data[0];
      console.log('[ORDER]  Email acheteur présent:', !!firstOrder.email);
      console.log('[ORDER]  Phone acheteur présent:', !!firstOrder.phone);
    }
    
    console.log('[ORDER] FIN RÉCUPÉRATION ');
    
    return response.data;
  } catch (error) {
    console.error('[ORDER ERROR] Erreur récupération commandes REÇUES:', error);
    console.error('[ORDER ERROR] Response:', error.response?.data);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    console.log('[ORDER]  RÉCUPÉRATION COMMANDE PAR ID ');
    console.log('[ORDER] ID:', orderId);
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token manquant - utilisateur non authentifié');
    }

    const response = await axiosClient.get(`/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('[ORDER]  Commande récupérée:', response.data);
    console.log('[ORDER]  Email:', response.data.email);
    console.log('[ORDER]  Phone:', response.data.phone);
    console.log('[ORDER]  FIN RÉCUPÉRATION ');
    
    return response.data;
  } catch (error) {
    console.error('[ORDER ERROR] Erreur récupération commande:', error);
    console.error('[ORDER ERROR] Response:', error.response?.data);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    console.log(`[ORDER] ANNULATION DE COMMANDE `);
    console.log(`[ORDER] ID: ${orderId}`);
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Pas de token - utilisateur non authentifié');
    }
    
    const response = await axiosClient.put(`/orders/${orderId}/cancel`, null, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('[ORDER]  Commande annulée:', response.data);
    console.log('[ORDER]  FIN ANNULATION ');
    
    return response.data;
  } catch (error) {
    console.error(`[ORDER ERROR] Erreur annulation commande ${orderId}:`, error);
    console.error('[ORDER ERROR] Response:', error.response?.data);
    throw error;
  }
};


export const updateOrderStatus = async (orderId, status) => {
  try {
    console.log('[ORDER] === MISE À JOUR STATUT ===');
    console.log('[ORDER] ID commande:', orderId);
    console.log('[ORDER] Nouveau statut:', status);
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Pas de token - utilisateur non authentifié');
    }
    
    const response = await axiosClient.put(
      `/orders/${orderId}/status`,
      { status: status },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    console.log('[ORDER]  Statut mis à jour avec succès:', response.data);
    console.log('[ORDER]  FIN MISE À JOUR STATUT ');
    
    return response.data;
  } catch (error) {
    console.error('[ORDER ERROR]  ERREUR MISE À JOUR STATUT ');
    console.error('[ORDER ERROR] Erreur:', error);
    console.error('[ORDER ERROR] Response:', error.response?.data);
    console.error('[ORDER ERROR] FIN ERREUR ');
    throw error;
  }
};


export const acceptOrder = async (orderId) => {
  try {
    console.log('[ORDER]  ACCEPTATION DE COMMANDE ');
    console.log('[ORDER] ID commande:', orderId);
    
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token) {
      throw new Error('Pas de token - utilisateur non authentifié');
    }

    // Afficher l'utilisateur connecté
    if (userStr) {
      const currentUser = JSON.parse(userStr);
      console.log('[ORDER]  Utilisateur connecté:', {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name
      });
    }

    //  Récupérer les détails de la commande AVANT d'accepter
    console.log('[ORDER]  Vérification des permissions...');
    const orderDetails = await getOrderById(orderId);
    console.log('[ORDER]  Détails de la commande:', {
      orderId: orderDetails.id,
      userId: orderDetails.userId,
      email: orderDetails.email,
      phone: orderDetails.phone,
      items: orderDetails.items?.map(item => ({
        productId: item.productId,
        productName: item.product?.name,
        sellerId: item.product?.userId
      }))
    });
    
    const response = await axiosClient.put(
      `/orders/${orderId}/accept`,
      null,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    console.log('[ORDER]  Commande acceptée avec succès:', response.data);
    console.log('[ORDER]  FIN ACCEPTATION ');
    
    return response.data;
  } catch (error) {
    console.error('[ORDER ERROR]  ERREUR ACCEPTATION ');
    console.error('[ORDER ERROR] Erreur:', error);
    console.error('[ORDER ERROR] Message:', error.message);
    console.error('[ORDER ERROR] Response:', error.response?.data);
    console.error('[ORDER ERROR] Status:', error.response?.status);
    console.error('[ORDER ERROR]  FIN ERREUR ');
    throw error;
  }
};


export const rejectOrder = async (orderId) => {
  try {
    console.log('[ORDER]  REJET DE COMMANDE ');
    console.log('[ORDER] ID commande:', orderId);
    
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token) {
      throw new Error('Pas de token - utilisateur non authentifié');
    }

    //  Afficher l'utilisateur connecté
    if (userStr) {
      const currentUser = JSON.parse(userStr);
      console.log('[ORDER]  Utilisateur connecté:', {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name
      });
    }

    //  Récupérer les détails de la commande AVANT de rejeter
    console.log('[ORDER]  Vérification des permissions...');
    const orderDetails = await getOrderById(orderId);
    console.log('[ORDER]  Détails de la commande:', {
      orderId: orderDetails.id,
      userId: orderDetails.userId,
      email: orderDetails.email,
      phone: orderDetails.phone,
      items: orderDetails.items?.map(item => ({
        productId: item.productId,
        productName: item.product?.name,
        sellerId: item.product?.userId
      }))
    });
    
    const response = await axiosClient.put(
      `/orders/${orderId}/reject`,
      null,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    console.log('[ORDER]  Commande rejetée avec succès:', response.data);
    console.log('[ORDER]  FIN REJET ');
    
    return response.data;
  } catch (error) {
    console.error('[ORDER ERROR]  ERREUR REJET ');
    console.error('[ORDER ERROR] Erreur:', error);
    console.error('[ORDER ERROR] Message:', error.message);
    console.error('[ORDER ERROR] Response:', error.response?.data);
    console.error('[ORDER ERROR] Status:', error.response?.status);
    console.error('[ORDER ERROR]  FIN ERREUR ');
    throw error;
  }
};