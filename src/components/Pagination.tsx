import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  showPageNumbers?: number; // Number of page numbers to show around current page
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  setCurrentPage,
  showPageNumbers = 5,
  className = ""
}) => {
  // Helper function to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const halfRange = Math.floor(showPageNumbers / 2);
    
    // Always show first page
    if (totalPages <= showPageNumbers) {
      // Show all pages if total is less than or equal to showPageNumbers
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex logic for ellipsis
      const startPage = Math.max(1, currentPage - halfRange);
      const endPage = Math.min(totalPages, currentPage + halfRange);
      
      // Always include first page
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('ellipsis-start');
        }
      }
      
      // Add pages around current page
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Always include last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('ellipsis-end');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        disabled={currentPage === 1}
        className={`
          flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all duration-200
          ${currentPage === 1
            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
          }
        `}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (typeof page === 'string') {
            return (
              <div
                key={`${page}-${index}`}
                className="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400"
                aria-label="More pages"
              >
                <MoreHorizontal size={18} />
              </div>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`
                flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all duration-200
                ${isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }
              `}
              aria-label={`Go to page ${page}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={goToNext}
        disabled={currentPage === totalPages}
        className={`
          flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all duration-200
          ${currentPage === totalPages
            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
          }
        `}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;