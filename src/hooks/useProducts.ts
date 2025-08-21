import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '../types';

// Mock API functions
const fetchProducts = async (): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    { id: '1', name: 'Premium Coffee', price: 4.50, category: 'Beverages' },
    { id: '2', name: 'Green Tea Latte', price: 5.25, category: 'Beverages' },
    { id: '3', name: 'Fresh Orange Juice', price: 3.75, category: 'Beverages' },
    { id: '4', name: 'Iced Americano', price: 4.00, category: 'Beverages' },
    { id: '5', name: 'Smoothie Bowl', price: 7.50, category: 'Beverages' },
    { id: '6', name: 'Artisan Sandwich', price: 12.95, category: 'Food' },
    { id: '7', name: 'Caesar Salad', price: 10.50, category: 'Food' },
    { id: '8', name: 'Margherita Pizza', price: 18.75, category: 'Food' },
    { id: '9', name: 'Grilled Chicken Burger', price: 15.25, category: 'Food' },
    { id: '10', name: 'Pasta Carbonara', price: 16.50, category: 'Food' },
    { id: '11', name: 'Chocolate Croissant', price: 3.50, category: 'Snacks' },
    { id: '12', name: 'Blueberry Muffin', price: 2.95, category: 'Snacks' },
    { id: '13', name: 'Mixed Nuts', price: 4.25, category: 'Snacks' },
    { id: '14', name: 'Granola Bar', price: 2.50, category: 'Snacks' },
    { id: '15', name: 'Fruit Cup', price: 3.75, category: 'Snacks' },
    { id: '16', name: 'Chocolate Cake', price: 6.50, category: 'Desserts' },
    { id: '17', name: 'Vanilla Ice Cream', price: 4.75, category: 'Desserts' },
    { id: '18', name: 'Apple Pie', price: 5.25, category: 'Desserts' },
    { id: '19', name: 'Cheesecake Slice', price: 7.00, category: 'Desserts' },
    { id: '20', name: 'Cookies (3 pack)', price: 3.95, category: 'Desserts' },
  ];
};

const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    ...product,
    id: Date.now().toString(),
  };
};

const updateProduct = async (product: Product): Promise<Product> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return product;
};

const deleteProduct = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};