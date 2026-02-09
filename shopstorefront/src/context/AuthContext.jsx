import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, register as registerApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger les données de l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    console.log(' AuthContext - Initialisation');
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('userName');
    const storedUserId = localStorage.getItem('userId');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser({
        username: storedUser,
        userId: storedUserId,
      });
      console.log(' Utilisateur restauré depuis localStorage');
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      console.log(' Tentative de connexion:', username);
      
      const response = await loginApi({ username, password });
      
 
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.userId);
      localStorage.setItem('userName', response.user.username);
      
     
      setToken(response.token);
      setUser({
        username: response.user.username,
        userId: response.user.userId,
      
      });
      
      console.log(' Connexion réussie');
      return { success: true, user: response.user };
    } catch (error) {
      console.error(' Erreur de connexion:', error);
      throw error;
    }
  };

  const register = async (username, password) => {
    try {
      console.log(' Tentative d\'inscription:', username);

      const response = await registerApi({ username, password });
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.userId);
      localStorage.setItem('userName', response.user.username);
      
     
      setToken(response.token);
      setUser({
        username: response.user.username,
        userId: response.user.userId,
        
      });
      
      console.log('Inscription réussie');
      return { success: true, user: response.user };
    } catch (error) {
      console.error(' Erreur d\'inscription:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log(' Déconnexion');
    
    // Nettoyer localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
   
    
    // Réinitialiser le state
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!token;
  };


  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

export default AuthContext;