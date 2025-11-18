import { useState, useEffect } from 'react';
import { Product } from '../types/pos';
import { useLowStockQuery, useProductCategoriesQuery, useProductQuery } from '../services/productService/product.query';
import { useDeleteProductMutation, useUpdateStockMutation } from '../services/productService/product.mutation';
import { queryClient } from '../lib/queryClient';

export const useInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditStockModal, setShowEditStockModal] = useState(false);
  const [editingStockItem, setEditingStockItem] = useState<Product | null>(null);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [selectedQRProduct, setSelectedQRProduct] = useState<Product | null>(null);

  const itemsPerPage = 5;

  const { data: items, isPending, isError } = useProductQuery(
    currentPage,
    itemsPerPage,
    debounceSearchTerm,
    selectedCategory === 'All' ? null : selectedCategory,
    'createdAt'
  );

  const { data: lowStockItems, isPending: lowStockPending, isError: lowStockError } = useLowStockQuery();



  const { data: categories, isPending: isPendingCategories } = useProductCategoriesQuery();
  const { mutate: updateStock, isPending: isPendingUpdateStock } = useUpdateStockMutation();
  const { mutate: deleteProduct } = useDeleteProductMutation();

  const totalPages = Math.ceil((items?.totalElements || 0) / itemsPerPage);
  // const lowStockItems = items?.results?.filter(item => item.stock <= 10);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceSearchTerm(searchTerm || '');
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleDelete = (id: string) => {
    deleteProduct(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
      },
      onError: (error) => {
        console.error('Delete Product error', error);
      }
    });
  };

  const handleEditStock = (item: Product) => {
    setEditingStockItem(item);
    setShowEditStockModal(true);
  };

  const handleUpdateStock = (id: string, newStock: number, reason: string) => {
    updateStock(
      { productId: id, quantity: newStock },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['products'] });
          setShowEditStockModal(false);
          setEditingStockItem(null);
        },
        onError: (error) => {
          console.error('Update Stock error', error);
        }
      }
    );
  };

  const handlePriceEdit = (id: string, price: number) => {
    updateStock(
      { productId: id, price },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['products'] });
          setShowEditStockModal(false);
          setEditingStockItem(null);
        },
        onError: (error) => {
          console.error('Update Price error', error);
        }
      }
    );
  };

  const handleQRCodeClick = (product: Product) => {
    setSelectedQRProduct(product);
    setShowQRCodeModal(true);
  };

  return {
    // Data
    items,
    categories,
    lowStockItems,
    totalPages,
    
    // Loading states
    isPending,
    isError,
    isPendingCategories,
    isPendingUpdateStock,
    
    // Search & Filter
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    
    // Modal states
    showAddModal,
    setShowAddModal,
    setShowEditStockModal,
    showEditStockModal,
    showQRCodeModal,
    setShowQRCodeModal,
    editingStockItem,
    selectedQRProduct,
    setSelectedQRProduct,
    
    // Actions
    handleDelete,
    handleEditStock,
    handleUpdateStock,
    handlePriceEdit,
    handleQRCodeClick,
  };
};
