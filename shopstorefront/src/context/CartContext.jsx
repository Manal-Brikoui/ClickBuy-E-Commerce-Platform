import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCart, addToCart as addToCartApi, updateCart, removeFromCart, clearCart as clearCartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    } else {
      setCart([]);
      setCartCount(0);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      const items = Array.isArray(data) ? data : (data?.items || []);

      setCart(items);
     
      setCartCount(items.reduce((total, item) => total + (item.Quantity || 0), 0));

      console.log(' Panier chargé:', items.length, 'articles');
    } catch (error) {
      console.error(' Erreur chargement panier:', error);
      setCart([]);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await addToCartApi(productId, quantity);
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error(' Erreur ajout panier:', error);
      throw error;
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      await updateCart(cartItemId, quantity);
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error(' Erreur mise à jour panier:', error);
      throw error;
    }
  };

  const removeCartItem = async (productId) => {
    try {
      await removeFromCart(productId);
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error(' Erreur suppression panier:', error);
      throw error;
    }
  };

  const clearAllCart = async () => {
    try {
      await clearCartApi();
      setCart([]);
      setCartCount(0);
      return { success: true };
    } catch (error) {
      console.error(' Erreur vidage panier:', error);
      throw error;
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.ProductPrice || 0) * (item.Quantity || 0);
    }, 0);
  };

  const value = {
    cart,
    cartCount,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearAllCart,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé à l\'intérieur d\'un CartProvider');
  }
  return context;
};

export default CartContext;