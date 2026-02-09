import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../api/productApi';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import PaginationBottom from '../components/PaginationBottom';
import {
  Package,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Loader,
  Upload,
} from 'lucide-react';

const Productlist = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',  
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9); 

  const userName = localStorage.getItem('userName');
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProducts();
  }, [token, navigate, userId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur fetchProducts:', error);
      showNotification('Erreur lors du chargement des produits', 'error');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculer les produits à afficher pour la page actuelle
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        description: product.description || '',  
        image: null,
      });
      setImagePreview(product.imageUrl ? `http://localhost:5017${product.imageUrl}` : null);
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', stock: '', description: '', image: null });  
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({ name: '', price: '', stock: '', description: '', image: null });  
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showNotification('Le nom du produit est requis', 'error');
      return;
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      showNotification('Le prix doit être un nombre positif', 'error');
      return;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      showNotification('Le stock doit être un nombre positif', 'error');
      return;
    }
    if (formData.description && formData.description.length > 2000) {
      showNotification('La description ne doit pas dépasser 2000 caractères', 'error');
      return;
    }

    try {
      setSubmitting(true);

      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description.trim() || undefined,  
        image: formData.image,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        showNotification('Produit modifié avec succès', 'success');
      } else {
        await createProduct(productData);
        showNotification('Produit créé avec succès', 'success');
      }

      closeModal();
      await fetchProducts();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      const errorMsg = error.response?.data?.message || 'Erreur lors de la sauvegarde du produit';
      showNotification(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      await deleteProduct(productId);
      showNotification('Produit supprimé avec succès', 'success');
      await fetchProducts();
      
      const newTotalPages = Math.ceil((products.length - 1) / productsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      const errorMsg = error.response?.data?.message || 'Erreur lors de la suppression';
      showNotification(errorMsg, 'error');
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Loader style={styles.spinner} size={48} />
        <p style={styles.loadingText}>Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
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
        `}
      </style>

      <Navbar
        userName={userName}
        onLogout={handleLogout}
      />

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
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>
            <Package size={28} />
            Nos Produits
          </h2>
          <button style={styles.addButton} onClick={() => openModal()}>
            <Plus size={20} />
            Ajouter un produit
          </button>
        </div>

        {products.length === 0 ? (
          <div style={styles.emptyProducts}>
            <Package size={80} color="#8b0000" />
            <h3 style={styles.emptyTitle}>Aucun produit disponible</h3>
            <p style={styles.emptyText}>Commencez par ajouter des produits</p>
          </div>
        ) : (
          <>
            <div style={styles.productsGrid}>
              {currentProducts.map((product) => {
                const isOwnProduct = product.userId?.toString() === userId;
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isOwnProduct={isOwnProduct}
                    onEdit={openModal}
                    onDelete={handleDelete}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <PaginationBottom
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      {showModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </h3>
              <button style={styles.closeButton} onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Nom du produit *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: iPhone 15 Pro"
                  style={styles.formInput}
                  required
                  disabled={submitting}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Prix (DH) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Ex: 9999.99"
                  step="0.01"
                  min="0"
                  style={styles.formInput}
                  required
                  disabled={submitting}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Ex: 50"
                  min="0"
                  style={styles.formInput}
                  required
                  disabled={submitting}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Description (optionnel)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez votre produit en détail... (max 2000 caractères)"
                  style={styles.formTextarea}
                  rows={4}
                  maxLength={2000}
                  disabled={submitting}
                />
                <small style={styles.charCounter}>
                  {formData.description.length}/2000 caractères
                </small>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Image du produit</label>
                <div style={styles.imageUpload}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={styles.fileInput}
                    id="imageInput"
                    disabled={submitting}
                  />
                  <label htmlFor="imageInput" style={styles.fileLabel}>
                    <Upload size={20} />
                    {formData.image ? formData.image.name : 'Choisir une image'}
                  </label>
                </div>
                {imagePreview && (
                  <div style={styles.imagePreview}>
                    <img src={imagePreview} alt="Preview" style={styles.previewImage} />
                  </div>
                )}
              </div>

              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelButton} onClick={closeModal} disabled={submitting}>
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{ ...styles.submitButton, ...(submitting && styles.submitButtonDisabled) }}
                  disabled={submitting}
                >
                  {submitting ? (
                    <><Loader style={styles.spinner} size={18} />{editingProduct ? 'Modification...' : 'Création...'}</>
                  ) : (
                    editingProduct ? 'Modifier' : 'Créer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '26px',
    color: 'white',
    margin: 0,
    fontWeight: '800',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#8b0000',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(139, 0, 0, 0.4)',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  emptyProducts: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    gap: '20px',
  },
  emptyTitle: {
    fontSize: '24px',
    color: '#1a1a2e',
    margin: 0,
    fontWeight: '800',
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
    fontWeight: '500',
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
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
    zIndex: 2000,
    animation: 'slideIn 0.3s ease',
    fontWeight: '600',
    fontSize: '14px',
  },
  notificationSuccess: { background: '#10b981', color: 'white' },
  notificationError: { background: '#8b0000', color: 'white' },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '16px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)',
  },
  loadingText: { color: 'white', fontSize: '18px', fontWeight: '600' },
  spinner: { animation: 'spin 1s linear infinite' },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    backdropFilter: 'blur(8px)',
  },
  modalContent: {
    background: 'white',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    animation: 'fadeIn 0.3s ease',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '2px solid #f0f0f0',
  },
  modalTitle: { fontSize: '20px', fontWeight: '800', color: '#1a1a2e', margin: 0 },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#666',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  modalForm: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  formLabel: { fontSize: '14px', fontWeight: '700', color: '#1a1a2e' },
  formInput: {
    padding: '12px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontWeight: '500',
  },
  formTextarea: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '15px',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '100px',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    boxSizing: 'border-box',
  },
  charCounter: {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px',
    display: 'block',
    fontWeight: '500',
  },
  imageUpload: { position: 'relative' },
  fileInput: { display: 'none' },
  fileLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 16px',
    border: '2px dashed #8b0000',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#8b0000',
    background: '#fef3c7',
    transition: 'all 0.2s',
  },
  imagePreview: {
    marginTop: '12px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '2px solid #e0e0e0',
  },
  previewImage: { width: '100%', height: '200px', objectFit: 'cover' },
  modalActions: { display: 'flex', gap: '12px', marginTop: '10px' },
  cancelButton: {
    flex: 1, padding: '12px', background: '#f0f0f0', color: '#666',
    border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
    transition: 'all 0.2s',
  },
  submitButton: {
    flex: 1, padding: '12px', background: 'linear-gradient(135deg, #8b0000, #6d0000)', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    transition: 'all 0.3s ease',
  },
  submitButtonDisabled: { opacity: 0.7, cursor: 'not-allowed' },
};

export default Productlist;