
import axios from 'axios';

const API_URL = 'http://localhost:5017/api/comments';

// Récupérer le token d'authentification
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Configuration des headers avec token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Créer un commentaire
export const createComment = async (productId, content, rating) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        productId,
        content,
        rating
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error);
    throw error;
  }
};

// Récupérer tous les commentaires d'un produit
export const getCommentsByProduct = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    throw error;
  }
};

// Récupérer un commentaire par ID
export const getCommentById = async (commentId) => {
  try {
    const response = await axios.get(`${API_URL}/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du commentaire:', error);
    throw error;
  }
};

// Mettre à jour un commentaire
export const updateComment = async (commentId, content, rating) => {
  try {
    const response = await axios.put(
      `${API_URL}/${commentId}`,
      {
        content,
        rating
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du commentaire:', error);
    throw error;
  }
};

// Supprimer un commentaire
export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${commentId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire:', error);
    throw error;
  }
};

// Récupérer les statistiques d'un produit 

export const getProductStats = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/product/${productId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error);
    throw error;
  }
};