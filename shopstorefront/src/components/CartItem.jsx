import React, { useState } from 'react';
import { Package, DollarSign, Plus, Minus, Trash2, Loader, User } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;

    try {
      setUpdating(true);
      await onUpdateQuantity(item.productId, newQuantity);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      setUpdating(true);
      await onRemove(item.productId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setUpdating(false);
    }
  };

  return (
    <div 
      style={styles.cartItem}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#8b0000';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#f0f0f0';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
      }}
    >
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={styles.itemImage}>
        {item.product?.imageUrl ? (
          <img
            src={`http://localhost:5017${item.product.imageUrl}`}
            alt={item.product.name}
            style={styles.productImage}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div style={{ ...styles.noImage, display: item.product?.imageUrl ? 'none' : 'flex' }}>
          <Package size={50} color="#1a1a2e" />
        </div>
      </div>

      <div style={styles.itemDetails}>
        <h3 style={styles.itemName}>{item.product?.name || 'Produit'}</h3>
        
        <div style={styles.sellerSection}>
          <User size={14} color="#1a1a2e" />
          <span style={styles.sellerName}>
            Vendu par: {item.product?.userName || 'Vendeur inconnu'}
          </span>
        </div>

        <div style={styles.itemPrice}>
          <DollarSign size={18} color="#8b0000" />
          <span>{item.product?.price?.toFixed(2) || '0.00'} DH</span>
        </div>
      </div>

      <div style={styles.itemActions}>
        <div style={styles.quantityControl}>
          <button
            style={{
              ...styles.quantityButton,
              ...(updating && styles.buttonDisabled),
            }}
            onClick={() => handleQuantityChange(-1)}
            disabled={updating || item.quantity <= 1}
            onMouseEnter={(e) => {
              if (!updating && item.quantity > 1) {
                e.currentTarget.style.borderColor = '#8b0000';
                e.currentTarget.style.color = '#8b0000';
                e.currentTarget.style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!updating && item.quantity > 1) {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.color = '#1a1a2e';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <Minus size={16} />
          </button>
          <span style={styles.quantity}>{item.quantity}</span>
          <button
            style={{
              ...styles.quantityButton,
              ...(updating && styles.buttonDisabled),
            }}
            onClick={() => handleQuantityChange(1)}
            disabled={updating}
            onMouseEnter={(e) => {
              if (!updating) {
                e.currentTarget.style.borderColor = '#8b0000';
                e.currentTarget.style.color = '#8b0000';
                e.currentTarget.style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!updating) {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.color = '#1a1a2e';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <Plus size={16} />
          </button>
        </div>

        <div style={styles.itemTotal}>
          <span style={styles.totalLabel}>Total</span>
          <span style={styles.totalPrice}>
            {((item.product?.price || 0) * item.quantity).toFixed(2)} DH
          </span>
        </div>

        <button
          style={{
            ...styles.removeButton,
            ...(updating && styles.buttonDisabled),
          }}
          onClick={handleRemove}
          disabled={updating}
          onMouseEnter={(e) => {
            if (!updating) {
              e.currentTarget.style.background = '#8b0000';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 0, 0, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!updating) {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#8b0000';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          {updating ? <Loader style={{ animation: 'spin 1s linear infinite' }} size={18} /> : <Trash2 size={18} />}
        </button>
      </div>
    </div>
  );
};

const styles = {
  cartItem: {
    background: 'white', 
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    border: '2px solid #f0f0f0',
  },
  itemImage: {
    width: '140px',
    height: '140px',
    borderRadius: '12px',
    overflow: 'hidden',
    background: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
    border: '2px solid #e0e0e0',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  itemName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
  },
  sellerSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: '#f5f5f5',
    borderRadius: '8px',
    width: 'fit-content',
    border: '1px solid #e0e0e0',
  },
  sellerName: {
    fontSize: '13px',
    color: '#1a1a2e',
    fontWeight: '600',
  },
  itemPrice: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '18px',
    color: '#8b0000',
    fontWeight: '700',
    padding: '8px 12px',
    background: 'white',
    border: '2px solid #8b0000',
    borderRadius: '8px',
    width: 'fit-content',
  },
  itemActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '16px',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#f5f5f5', 
    borderRadius: '12px',
    padding: '8px',
    border: '2px solid #e0e0e0',
  },
  quantityButton: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: '#1a1a2e',
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  quantity: {
    fontSize: '18px',
    fontWeight: '700',
    minWidth: '40px',
    textAlign: 'center',
    color: '#1a1a2e',
  },
  itemTotal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
    padding: '12px 16px',
    background: 'white',
    border: '2px solid #8b0000',
    borderRadius: '12px',
  },
  totalLabel: {
    fontSize: '13px',
    color: '#1a1a2e',
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#8b0000',
  },
  removeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    background: 'white',
    color: '#8b0000',
    border: '2px solid #8b0000',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '700',
  },
};

export default CartItem;