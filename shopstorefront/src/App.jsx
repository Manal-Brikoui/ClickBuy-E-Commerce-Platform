import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Productlist from './pages/Productlist';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import NotificationsPage from './pages/NotificationsPage';
import ReceivedOrdersPage from './pages/ReceivedOrdersPage';
import DiagnosticAuth from './pages/DiagnosticAuth';

function App() {
  console.log('[*] Application ShopStore démarrée');

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div style={styles.app}>
            <style>
              {`
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(-10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                
                @keyframes slideIn {
                  from { transform: translateX(400px); opacity: 0; }
                  to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.5; }
                }

                ::-webkit-scrollbar {
                  width: 10px;
                }
                
                ::-webkit-scrollbar-track {
                  background: #f1f1f1;
                }
                
                ::-webkit-scrollbar-thumb {
                  background: #8B4513;
                  border-radius: 5px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                  background: #6d3410;
                }
              `}
            </style>

            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/products" element={<Productlist />} />
              <Route path="/product/:id" element={<ProductDetails />} />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/received-orders"
                element={
                  <ProtectedRoute>
                    <ReceivedOrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/diagnostic" element={<DiagnosticAuth />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
};

export default App;