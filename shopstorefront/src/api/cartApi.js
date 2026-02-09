
import axiosClient from './axiosClient';

export const getCart = async () => {
  try {
    console.log('[CART] Récupération du panier...');
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token manquant - utilisateur non authentifié');
    }
    
    const response = await axiosClient.get('/cart', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('[CART] Panier récupéré:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('[CART ERROR] Erreur récupération panier:', error.response?.data || error);
    throw error;
  }
};


export const addToCart = async (productId, quantity) => {
  try {
    console.log('[CART] Ajout au panier:', { productId, quantity });
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token manquant - utilisateur non authentifié');
    }
    
    const response = await axiosClient.post('/cart/add', {
      productId: productId,
      quantity: quantity,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('[CART] Produit ajouté au panier:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('[CART ERROR] Erreur ajout au panier:', error.response?.data || error);
    throw error;
  }
};

export const updateCart = async (cartItemId, quantity) => {
  try {
    console.log('[CART] Mise à jour panier:', { cartItemId, quantity });
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token manquant - utilisateur non authentifié');
    }
    
    const response = await axiosClient.put('/cart/update', {
      CartItemId: cartItemId,
      Quantity: quantity,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('[CART] Panier mis à jour:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('[CART ERROR] Erreur mise à jour panier:', error.response?.data || error);
    throw error;
  }
};


export const removeFromCart = async (productId) => {
  try {
    console.log('[CART] Suppression article:', productId);
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token manquant - utilisateur non authentifié');
    }
    
    const response = await axiosClient.delete(`/cart/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('[CART] Article retiré du panier:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('[CART ERROR] Erreur suppression article:', error.response?.data || error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    console.log('[CART] Vidage du panier...');
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token manquant - utilisateur non authentifié');
    }
    
    const response = await axiosClient.delete('/cart/clear', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('[CART] Panier vidé:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('[CART ERROR] Erreur vidage panier:', error.response?.data || error);
    throw error;
  }
};