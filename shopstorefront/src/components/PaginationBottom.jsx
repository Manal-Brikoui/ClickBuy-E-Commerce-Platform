import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const PaginationBottom = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage = 12,
  totalItems = 0
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = Math.min(5, totalPages);
      }

      if (currentPage >= totalPages - 2) {
        startPage = Math.max(totalPages - 4, 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div style={styles.paginationContainer}>
      <div style={styles.itemsInfo}>
        Affichage de <strong style={styles.strong}>{startItem}</strong> à <strong style={styles.strong}>{endItem}</strong> sur <strong style={styles.strong}>{totalItems}</strong> produits
      </div>

      <div style={styles.paginationButtons}>
        <button
          style={{
            ...styles.pageButton,
            ...(currentPage === 1 && styles.pageButtonDisabled),
          }}
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          title="Première page"
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.background = '#f5f5f5';
              e.currentTarget.style.borderColor = '#8b0000';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          <ChevronsLeft size={18} />
        </button>

        <button
          style={{
            ...styles.pageButton,
            ...(currentPage === 1 && styles.pageButtonDisabled),
          }}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Page précédente"
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.background = '#f5f5f5';
              e.currentTarget.style.borderColor = '#8b0000';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          <ChevronLeft size={18} />
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            style={{
              ...styles.pageButton,
              ...styles.pageNumber,
              ...(page === currentPage && styles.pageNumberActive),
            }}
            onClick={() => handlePageChange(page)}
            onMouseEnter={(e) => {
              if (page !== currentPage) {
                e.currentTarget.style.background = '#f5f5f5';
                e.currentTarget.style.borderColor = '#8b0000';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (page !== currentPage) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {page}
          </button>
        ))}

        <button
          style={{
            ...styles.pageButton,
            ...(currentPage === totalPages && styles.pageButtonDisabled),
          }}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Page suivante"
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.background = '#f5f5f5';
              e.currentTarget.style.borderColor = '#8b0000';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          <ChevronRight size={18} />
        </button>

        <button
          style={{
            ...styles.pageButton,
            ...(currentPage === totalPages && styles.pageButtonDisabled),
          }}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Dernière page"
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.background = '#f5f5f5';
              e.currentTarget.style.borderColor = '#8b0000';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          <ChevronsRight size={18} />
        </button>
      </div>

      <div style={styles.pageSelector}>
        <span style={styles.pageSelectorLabel}>Page:</span>
        <select
          style={styles.pageSelect}
          value={currentPage}
          onChange={(e) => handlePageChange(Number(e.target.value))}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#8b0000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e0e0e0';
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#8b0000';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 0, 0, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e0e0e0';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </select>
        <span style={styles.pageSelectorLabel}>sur {totalPages}</span>
      </div>
    </div>
  );
};

const styles = {
  paginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    marginTop: '30px',
    flexWrap: 'wrap',
    gap: '16px',
    border: '2px solid #f0f0f0',
  },
  itemsInfo: {
    fontSize: '14px',
    color: '#1a1a2e',
    fontWeight: '600',
  },
  strong: {
    color: '#8b0000',
  },
  paginationButtons: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  pageButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    background: 'white',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: '#1a1a2e',
    fontSize: '14px',
    fontWeight: '700',
  },
  pageButtonDisabled: {
    opacity: 0.3,
    cursor: 'not-allowed',
  },
  pageNumber: {
    minWidth: '40px',
    width: 'auto',
    padding: '0 14px',
  },
  pageNumberActive: {
    background: '#8b0000',
    color: 'white',
    borderColor: '#8b0000',
    boxShadow: '0 4px 12px rgba(139, 0, 0, 0.3)',
  },
  pageSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  pageSelectorLabel: {
    fontSize: '14px',
    color: '#1a1a2e',
    fontWeight: '600',
  },
  pageSelect: {
    padding: '8px 14px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    outline: 'none',
    background: 'white',
    color: '#1a1a2e',
    transition: 'all 0.3s ease',
  },
};

export default PaginationBottom;