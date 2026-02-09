import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, Box, Edit, Trash2, User, AlertTriangle } from 'lucide-react';

const ProductCard = ({ product, isOwnProduct, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(product);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(product.id);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div style={styles.card} onClick={handleCardClick}>
      <style>
        {`
          @keyframes cardHover {
            from {
              transform: translateY(0);
            }
            to {
              transform: translateY(-8px);
            }
          }
        `}
      </style>

      <div style={styles.imageContainer}>
        {product.imageUrl ? (
          <img
            src={`http://localhost:5017${product.imageUrl}`}
            alt={product.name}
            style={styles.image}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div style={{ ...styles.noImage, display: product.imageUrl ? 'none' : 'flex' }}>
          <Package size={60} color="#1a1a2e" />
        </div>
        
        {isOwnProduct && (
          <div style={styles.ownBadge}>
            <User size={14} />
            <span>Votre produit</span>
          </div>
        )}

        {isOutOfStock && !isOwnProduct && (
          <div style={styles.outOfStockBadge}>
            <AlertTriangle size={14} />
            <span>Rupture de stock</span>
          </div>
        )}
      </div>

      <div style={styles.content}>
        <h3 style={styles.productName}>{product.name}</h3>

        <div style={styles.sellerSection}>
          <User size={14} color="#1a1a2e" />
          <span style={styles.sellerName}>
            {product.userName || 'Vendeur inconnu'}
          </span>
        </div>

        <div style={styles.priceSection}>
          <div style={styles.price}>
            <DollarSign size={20} color="#8b0000" />
            <span>{product.price?.toFixed(2)} DH</span>
          </div>
        </div>

        <div style={styles.stockSection}>
          <Box size={16} color={isOutOfStock ? '#8b0000' : '#1a1a2e'} />
          <span style={{
            ...styles.stock,
            color: isOutOfStock ? '#8b0000' : '#1a1a2e',
            fontWeight: isOutOfStock ? '600' : '500',
          }}>
            Stock: {product.stock} unité{product.stock > 1 ? 's' : ''}
          </span>
        </div>

        {isOwnProduct && (
          <div style={styles.actions}>
            <button
              style={styles.editButton}
              onClick={handleEdit}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#16213e';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 26, 46, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1a1a2e';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              title="Modifier"
            >
              <Edit size={16} />
              Modifier
            </button>
            <button
              style={styles.deleteButton}
              onClick={handleDelete}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#a00000';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#8b0000';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              title="Supprimer"
            >
              <Trash2 size={16} />
              Supprimer
            </button>
          </div>
        )}

        {isOwnProduct && (
          <div style={styles.infoMessage}>
            <AlertTriangle size={14} color="#1a1a2e" />
            <span>Vous ne pouvez pas acheter vos propres produits</span>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    border: '2px solid #f0f0f0',
  },
  imageContainer: {
    width: '100%',
    height: '220px',
    background: 'linear-gradient(135deg, #e4e4e8 0%, #ffffff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
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
    background: '#f5f5f5',
  },
  ownBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: '#8b0000',
    color: 'white',
    padding: '8px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(139, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: '#1a1a2e',
    color: 'white',
    padding: '8px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(26, 26, 46, 0.4)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  content: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
  },
  productName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  sellerSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: '#f5f5f5',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  sellerName: {
    fontSize: '13px',
    color: '#1a1a2e',
    fontWeight: '600',
  },
  priceSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '22px',
    fontWeight: '800',
    color: '#8b0000',
    padding: '8px 16px',
    background: 'white',
    border: '2px solid #8b0000',
    borderRadius: '12px',
  },
  stockSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: '#f5f5f5',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  stock: {
    fontSize: '14px',
    fontWeight: '500',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '8px',
  },
  editButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 14px',
    background: '#1a1a2e',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  deleteButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 14px',
    background: '#8b0000',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  infoMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#c8c8df',
    fontWeight: '600',
    textAlign: 'center',
    padding: '10px',
    background: '#f5f5f5',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    marginTop: '4px',
  },
};

export default ProductCard;