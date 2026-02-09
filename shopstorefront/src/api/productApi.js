
import axiosClient from './axiosClient';


export const getAllProducts = async () => {
  try {
    console.log('[PRODUCT] Récupération de tous les produits...');
    
    const response = await axiosClient.get('/product');
    
    console.log('[PRODUCT] Produits récupérés:', {
      count: response.data.length,
      data: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('[PRODUCT ERROR] Erreur lors de la récupération des produits:', error);
    throw error;
  }
};


export const getProductById = async (id) => {
  try {
    console.log(`[PRODUCT] Récupération du produit ID: ${id}`);
    
    const response = await axiosClient.get(`/product/${id}`);
    
    console.log('[PRODUCT] Produit récupéré:', response.data);
    
    return response.data;
  } catch (error) {
    console.error(`[PRODUCT ERROR] Erreur lors de la récupération du produit ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    console.log('[PRODUCT] CRÉATION PRODUIT ');
    console.log('[PRODUCT] Données:', productData);
    

    const formData = new FormData();
    formData.append('Name', productData.name);
    formData.append('Price', productData.price);
    formData.append('Stock', productData.stock);
    
    //  Ajouter la description si elle existe
    if (productData.description) {
      formData.append('Description', productData.description);
      console.log('[PRODUCT] Description incluse:', productData.description.substring(0, 50) + '...');
    }
    
    if (productData.image) {
      formData.append('Image', productData.image);
      console.log('[PRODUCT] Image incluse:', productData.image.name);
    }

    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token manquant - utilisateur non authentifié');
    }
    
    const response = await axiosClient.post('/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('[PRODUCT] Produit créé avec succès:', response.data);
    console.log('[PRODUCT]  FIN CRÉATION ');
    
    return response.data;
  } catch (error) {
    console.error('[PRODUCT ERROR]  ERREUR CRÉATION ');
    console.error('[PRODUCT ERROR] Erreur:', error);
    console.error('[PRODUCT ERROR] Response:', error.response?.data);
    console.error('[PRODUCT ERROR] FIN ERREUR ');
    throw error;
  }
};


export const updateProduct = async (id, productData) => {
  try {
    console.log('[PRODUCT]  MISE À JOUR PRODUIT ');
    console.log(`[PRODUCT] ID: ${id}`);
    console.log('[PRODUCT] Données:', productData);
    
    const formData = new FormData();
    formData.append('Name', productData.name);
    formData.append('Price', productData.price);
    formData.append('Stock', productData.stock);
    
    //  Ajouter la description si elle existe
    if (productData.description) {
      formData.append('Description', productData.description);
      console.log('[PRODUCT] Description incluse:', productData.description.substring(0, 50) + '...');
    }
    
    if (productData.image) {
      formData.append('Image', productData.image);
      console.log('[PRODUCT] Nouvelle image incluse:', productData.image.name);
    }

    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token manquant - utilisateur non authentifié');
    }
    
    const response = await axiosClient.put(`/product/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('[PRODUCT] Produit mis à jour avec succès:', response.data);
    console.log('[PRODUCT]  FIN MISE À JOUR ');
    
    return response.data;
  } catch (error) {
    console.error('[PRODUCT ERROR]  ERREUR MISE À JOUR ');
    console.error(`[PRODUCT ERROR] Erreur pour produit ${id}:`, error);
    console.error('[PRODUCT ERROR] Response:', error.response?.data);
    console.error('[PRODUCT ERROR]  FIN ERREUR');
    throw error;
  }
};


export const deleteProduct = async (id) => {
  try {
    console.log('[PRODUCT]  SUPPRESSION PRODUIT ');
    console.log(`[PRODUCT] ID: ${id}`);
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token manquant - utilisateur non authentifié');
    }
    
    const response = await axiosClient.delete(`/product/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('[PRODUCT] Produit supprimé avec succès:', response.data);
    console.log('[PRODUCT]  FIN SUPPRESSION');
    
    return response.data;
  } catch (error) {
    console.error('[PRODUCT ERROR]  ERREUR SUPPRESSION ');
    console.error(`[PRODUCT ERROR] Erreur pour produit ${id}:`, error);
    console.error('[PRODUCT ERROR] Response:', error.response?.data);
    console.error('[PRODUCT ERROR]  FIN ERREUR ');
    throw error;
  }
};

export const testConnection = async () => {
  try {
    console.log('[PRODUCT] Test de connexion à l\'API...');
    
    const response = await axiosClient.get('/product/test-connection');
    
    console.log('[PRODUCT] Connexion API réussie:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('[PRODUCT ERROR] Erreur de connexion à l\'API:', error);
    throw error;
  }
};