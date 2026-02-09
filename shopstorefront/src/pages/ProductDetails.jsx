import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/productApi';
import { addToCart } from '../api/cartApi';
import {
  createComment,
  getCommentsByProduct,
  updateComment,
  deleteComment,
  getProductStats
} from '../api/commentApi';
import {
  Package,
  DollarSign,
  Box,
  ShoppingCart,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Minus,
  Plus,
  User,
  Star,
  MessageSquare,
  Edit2,
  Trash2,
  Send,
} from 'lucide-react';
import Navbar from '../components/Navbar';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [stats, setStats] = useState({ averageRating: 0, commentCount: 0 });

  const userName = localStorage.getItem('userName');
  const userId = parseInt(localStorage.getItem('userId'));

  useEffect(() => {
    fetchProduct();
    fetchComments();
    fetchStats();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      showNotification('Erreur lors du chargement du produit.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getCommentsByProduct(id);
      setComments(data);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getProductStats(id);
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3500);
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (product.userId === userId) {
      showNotification('Vous ne pouvez pas acheter vos propres produits.', 'error');
      return;
    }

    if (product.stock <= 0) {
      showNotification('Ce produit est en rupture de stock.', 'error');
      return;
    }

    if (quantity > product.stock) {
      showNotification(`Seulement ${product.stock} unité(s) disponible(s).`, 'error');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      showNotification(`${quantity} × ${product.name} ajouté(s) au panier !`, 'success');
      setQuantity(1);
    } catch (error) {
      const msg = error.response?.data?.message || 'Erreur lors de l\'ajout au panier.';
      showNotification(msg, 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      showNotification('Veuillez écrire un commentaire.', 'error');
      return;
    }

    try {
      setSubmittingComment(true);
      await createComment(id, commentContent, rating);
      showNotification('Commentaire ajouté avec succès !', 'success');
      setCommentContent('');
      setRating(5);
      fetchComments();
      fetchStats();
    } catch (error) {
      const msg = error.response?.data?.message || 'Erreur lors de l\'ajout du commentaire.';
      showNotification(msg, 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
    setEditRating(comment.rating || 5);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) {
      showNotification('Veuillez écrire un commentaire.', 'error');
      return;
    }

    try {
      await updateComment(commentId, editContent, editRating);
      showNotification('Commentaire modifié avec succès !', 'success');
      setEditingCommentId(null);
      setEditContent('');
      setEditRating(5);
      fetchComments();
      fetchStats();
    } catch (error) {
      const msg = error.response?.data?.message || 'Erreur lors de la modification.';
      showNotification(msg, 'error');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      return;
    }

    try {
      await deleteComment(commentId);
      showNotification('Commentaire supprimé avec succès !', 'success');
      fetchComments();
      fetchStats();
    } catch (error) {
      const msg = error.response?.data?.message || 'Erreur lors de la suppression.';
      showNotification(msg, 'error');
    }
  };

  const renderStars = (currentRating, isInteractive = false, onRatingChange = null) => {
    return (
      <div style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={isInteractive ? 24 : 18}
            fill={star <= (isInteractive ? (hoverRating || currentRating) : currentRating) ? '#fbbf24' : 'none'}
            color={star <= (isInteractive ? (hoverRating || currentRating) : currentRating) ? '#fbbf24' : '#d1d5db'}
            style={isInteractive ? { cursor: 'pointer' } : {}}
            onClick={() => isInteractive && onRatingChange && onRatingChange(star)}
            onMouseEnter={() => isInteractive && setHoverRating(star)}
            onMouseLeave={() => isInteractive && setHoverRating(0)}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <Navbar userName={userName} onLogout={handleLogout} />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={styles.pageWrapper}>
        <Navbar userName={userName} onLogout={handleLogout} />
        <div style={styles.errorContainer}>
          <AlertCircle size={48} color="#8b0000" />
          <h2 style={styles.errorTitle}>Produit introuvable</h2>
          <button style={styles.backButton} onClick={() => navigate('/products')}>
            <ArrowLeft size={18} />
            Retour aux produits
          </button>
        </div>
      </div>
    );
  }

  const isOwnProduct = product.userId === userId;
  const isOutOfStock = product.stock <= 0;

  return (
    <div style={styles.pageWrapper}>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <Navbar userName={userName} onLogout={handleLogout} />

      {notification.show && (
        <div style={{
          ...styles.notification,
          ...(notification.type === 'success' ? styles.notificationSuccess : styles.notificationError)
        }}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{notification.message}</span>
        </div>
      )}

      <div style={styles.container}>
        <button style={styles.backButtonTop} onClick={() => navigate('/products')}>
          <ArrowLeft size={18} />
          Retour aux produits
        </button>

        <div style={styles.productContainer}>
          <div style={styles.imageSection}>
            {product.imageUrl ? (
              <img
                src={`http://localhost:5017${product.imageUrl}`}
                alt={product.name}
                style={styles.productImage}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div style={{ ...styles.noImage, display: product.imageUrl ? 'none' : 'flex' }}>
              <Package size={100} color="#8b0000" />
            </div>

            {isOwnProduct && (
              <div style={styles.ownBadgeLarge}>
                <User size={16} />
                Votre produit
              </div>
            )}
            {isOutOfStock && !isOwnProduct && (
              <div style={styles.outOfStockBadgeLarge}>Rupture de stock</div>
            )}
          </div>

          <div style={styles.detailsSection}>
            <h1 style={styles.productTitle}>{product.name}</h1>

            {product.userName && (
              <div style={styles.creatorContainer}>
                <User size={18} color="#8b0000" />
                <span style={styles.creatorText}>Vendu par: <strong>{product.userName}</strong></span>
              </div>
            )}

            {stats.commentCount > 0 && (
              <div style={styles.ratingStatsContainer}>
                {renderStars(stats.averageRating)}
                <span style={styles.ratingText}>
                  {stats.averageRating.toFixed(1)} ({stats.commentCount} avis)
                </span>
              </div>
            )}

            <div style={styles.priceContainer}>
              <DollarSign size={32} color="#8b0000" />
              <span style={styles.productPrice}>{product.price?.toFixed(2)} DH</span>
            </div>

            <div style={styles.stockContainer}>
              <Box size={20} color={isOutOfStock ? '#8b0000' : '#10b981'} />
              <span style={{
                ...styles.stockText,
                color: isOutOfStock ? '#8b0000' : '#10b981',
              }}>
                {isOutOfStock ? 'Rupture de stock' : `${product.stock} unité(s) en stock`}
              </span>
            </div>

            {product.description && (
              <div style={styles.descriptionContainer}>
                <h3 style={styles.descriptionTitle}>Description</h3>
                <p style={styles.descriptionText}>{product.description}</p>
              </div>
            )}

            {!isOwnProduct && !isOutOfStock && (
              <div style={styles.cartSection}>
                <div style={styles.quantityContainer}>
                  <span style={styles.quantityLabel}>Quantité :</span>
                  <div style={styles.quantityControls}>
                    <button
                      style={styles.quantityButton}
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span style={styles.quantityValue}>{quantity}</span>
                    <button
                      style={styles.quantityButton}
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <button
                  style={{
                    ...styles.addToCartButton,
                    ...(addingToCart && styles.addToCartButtonDisabled)
                  }}
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? (
                    <>
                      <div style={styles.spinner}></div>
                      Ajout en cours...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Ajouter au panier
                    </>
                  )}
                </button>
              </div>
            )}

            {isOwnProduct && (
              <div style={styles.ownProductMessage}>
                <AlertCircle size={20} color="#8b0000" />
                <div>
                  <h4 style={styles.ownProductTitle}>Votre produit</h4>
                  <p style={styles.ownProductText}>
                    Vous ne pouvez pas acheter vos propres produits. Vous pouvez le modifier ou le supprimer depuis la liste des produits.
                  </p>
                </div>
              </div>
            )}

            {isOutOfStock && !isOwnProduct && (
              <div style={styles.outOfStockMessage}>
                <AlertCircle size={20} color="#8b0000" />
                <div>
                  <h4 style={styles.outOfStockTitle}>Rupture de stock</h4>
                  <p style={styles.outOfStockText}>
                    Ce produit n'est actuellement pas disponible.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={styles.commentsSection}>
          <div style={styles.commentsHeader}>
            <MessageSquare size={28} color="#8b0000" />
            <h2 style={styles.commentsTitle}>Avis clients ({comments.length})</h2>
          </div>

          {!isOwnProduct && (
            <form onSubmit={handleSubmitComment} style={styles.commentForm}>
              <h3 style={styles.formTitle}>Laisser un avis</h3>
              
              <div style={styles.ratingInputContainer}>
                <span style={styles.ratingLabel}>Note :</span>
                {renderStars(rating, true, setRating)}
              </div>

              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Partagez votre expérience avec ce produit..."
                style={styles.commentTextarea}
                rows={4}
              />

              <button
                type="submit"
                disabled={submittingComment}
                style={{
                  ...styles.submitCommentButton,
                  ...(submittingComment && styles.submitCommentButtonDisabled)
                }}
              >
                {submittingComment ? (
                  <>
                    <div style={styles.smallSpinner}></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Publier l'avis
                  </>
                )}
              </button>
            </form>
          )}

          <div style={styles.commentsList}>
            {comments.length === 0 ? (
              <div style={styles.noComments}>
                <MessageSquare size={48} color="#9ca3af" />
                <p style={styles.noCommentsText}>Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} style={styles.commentCard}>
                  <div style={styles.commentHeader}>
                    <div style={styles.commentUserInfo}>
                      <User size={20} color="#8b0000" />
                      <span style={styles.commentUserName}>{comment.userName}</span>
                      {comment.rating && renderStars(comment.rating)}
                    </div>
                    <span style={styles.commentDate}>
                      {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {editingCommentId === comment.id ? (
                    <div style={styles.editCommentForm}>
                      <div style={styles.ratingInputContainer}>
                        <span style={styles.ratingLabel}>Note :</span>
                        {renderStars(editRating, true, setEditRating)}
                      </div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        style={styles.commentTextarea}
                        rows={3}
                      />
                      <div style={styles.editActions}>
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          style={styles.saveButton}
                        >
                          <CheckCircle size={16} />
                          Enregistrer
                        </button>
                        <button
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditContent('');
                            setEditRating(5);
                          }}
                          style={styles.cancelButton}
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p style={styles.commentContent}>{comment.content}</p>
                      {comment.updatedAt && (
                        <span style={styles.editedLabel}>(modifié)</span>
                      )}

                      {comment.userId === userId && (
                        <div style={styles.commentActions}>
                          <button
                            onClick={() => handleEditComment(comment)}
                            style={styles.editButton}
                          >
                            <Edit2 size={16} />
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            style={styles.deleteButton}
                          >
                            <Trash2 size={16} />
                            Supprimer
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  backButtonTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '24px',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  productContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'fadeIn 0.5s ease',
  },
  imageSection: {
    position: 'relative',
    width: '100%',
    height: '500px',
    borderRadius: '12px',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownBadgeLarge: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#fbbf24',
    color: '#000',
    padding: '10px 16px',
    borderRadius: '24px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  outOfStockBadgeLarge: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: '#8b0000',
    color: 'white',
    padding: '10px 16px',
    borderRadius: '24px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  detailsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  productTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    margin: 0,
  },
  creatorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: '#fef3c7',
    borderRadius: '10px',
    border: '2px solid #fcd34d',
  },
  creatorText: {
    fontSize: '15px',
    color: '#78350f',
  },
  ratingStatsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
  },
  ratingText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#4b5563',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  productPrice: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#8b0000',
  },
  stockContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stockText: {
    fontSize: '16px',
    fontWeight: '600',
  },
  descriptionContainer: {
    marginTop: '8px',
  },
  descriptionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '8px',
  },
  descriptionText: {
    fontSize: '15px',
    color: '#666',
    lineHeight: '1.6',
  },
  cartSection: {
    marginTop: '16px',
    paddingTop: '24px',
    borderTop: '2px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  quantityContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  quantityLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a2e',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#f9fafb',
    padding: '8px 16px',
    borderRadius: '8px',
  },
  quantityButton: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#8b0000',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  quantityValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    minWidth: '40px',
    textAlign: 'center',
  },
  addToCartButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #8b0000, #6d0000)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  addToCartButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  ownProductMessage: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    background: '#fef3c7',
    border: '2px solid #fcd34d',
    borderRadius: '10px',
    marginTop: '16px',
  },
  ownProductTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#92400e',
    margin: '0 0 4px 0',
  },
  ownProductText: {
    fontSize: '14px',
    color: '#78350f',
    margin: 0,
    lineHeight: '1.5',
  },
  outOfStockMessage: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    background: '#fee2e2',
    border: '2px solid #fca5a5',
    borderRadius: '10px',
    marginTop: '16px',
  },
  outOfStockTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#8b0000',
    margin: '0 0 4px 0',
  },
  outOfStockText: {
    fontSize: '14px',
    color: '#7f1d1d',
    margin: 0,
  },
  
  commentsSection: {
    marginTop: '40px',
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'fadeIn 0.5s ease 0.2s backwards',
  },
  commentsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e5e7eb',
  },
  commentsTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    margin: 0,
  },
  commentForm: {
    background: '#f9fafb',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '32px',
    border: '2px solid #e5e7eb',
  },
  formTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '16px',
  },
  ratingInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  ratingLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a2e',
  },
  starsContainer: {
    display: 'flex',
    gap: '4px',
  },
  commentTextarea: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '15px',
    fontFamily: 'inherit',
    resize: 'vertical',
    marginBottom: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  submitCommentButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #8b0000, #6d0000)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  submitCommentButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  noComments: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '16px',
  },
  noCommentsText: {
    fontSize: '16px',
    color: '#6b7280',
    textAlign: 'center',
  },
  commentCard: {
    background: '#ffffff',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    transition: 'all 0.3s ease',
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  commentUserInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  commentUserName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a2e',
  },
  commentDate: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  commentContent: {
    fontSize: '15px',
    color: '#4b5563',
    lineHeight: '1.6',
    margin: '0 0 8px 0',
  },
  editedLabel: {
    fontSize: '12px',
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  commentActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '12px',
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  deleteButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#8b0000',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  editCommentForm: {
    marginTop: '12px',
  },
  editActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '12px',
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '8px 16px',
    background: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  smallSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '16px',
    color: 'white',
    fontWeight: '600',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '24px',
  },
  errorTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'white',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  notification: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 24px',
    borderRadius: '10px',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
    zIndex: 2000,
    animation: 'slideIn 0.3s ease',
    fontWeight: '600',
    fontSize: '14px',
  },
  notificationSuccess: {
    background: '#10b981',
    color: 'white',
  },
  notificationError: {
    background: '#8b0000',
    color: 'white',
  },
};

export default ProductDetails;