import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Package, AlertCircle, Inbox, CheckCircle } from 'lucide-react';
import { getUnreadCount, getAllNotifications, markAsRead } from '../api/notificationApi';
import './NotificationBell.css';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUnreadCount();
    
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Erreur lors du chargement du compteur:', error);
    }
  };

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await getAllNotifications(false);
      setNotifications(data);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBellClick = async () => {
    if (!showDropdown) {
      await loadNotifications();
    }
    setShowDropdown(!showDropdown);
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markAsRead(notification.id);
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      setShowDropdown(false);

      if (notification.orderId) {
        navigate('/orders');
      }
    } catch (error) {
      console.error('Erreur lors du clic sur la notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ORDER_RECEIVED':
        return <Package size={20} color="#6366f1" />;
      case 'ORDER_STATUS_CHANGED':
        return <CheckCircle size={20} color="#10b981" />;
      default:
        return <AlertCircle size={20} color="#64748b" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button className="notification-bell-btn" onClick={handleBellClick}>
        <Bell size={20} color={unreadCount > 0 ? "#fbbf24" : "white"} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>
      {unreadCount > 0 && (
        <div className="notification-count-label">
          {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
        </div>
      )}

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <span className="unread-count">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</span>
            )}
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">Chargement...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <Inbox size={48} color="#cbd5e1" />
                <p>Aucune notification</p>
              </div>
            ) : (
              notifications.slice(0, 5).map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">{notif.message}</p>
                    <span className="notification-time">{formatDate(notif.createdAt)}</span>
                  </div>
                  {!notif.isRead && <div className="notification-dot"></div>}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <button onClick={() => {
                setShowDropdown(false);
                navigate('/notifications');
              }}>
                Voir toutes les notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;