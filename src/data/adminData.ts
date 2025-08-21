import { User, SalesData, InventoryItem, DashboardStats } from '../types/admin';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@quickpos.com',
    role: 'admin',
    status: 'active',
    lastLogin: new Date('2024-01-15T10:30:00'),
    createdAt: new Date('2024-01-01T00:00:00')
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@quickpos.com',
    role: 'manager',
    status: 'active',
    lastLogin: new Date('2024-01-15T09:15:00'),
    createdAt: new Date('2024-01-05T00:00:00')
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@quickpos.com',
    role: 'cashier',
    status: 'active',
    lastLogin: new Date('2024-01-14T16:45:00'),
    createdAt: new Date('2024-01-10T00:00:00')
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@quickpos.com',
    role: 'cashier',
    status: 'inactive',
    createdAt: new Date('2024-01-12T00:00:00')
  }
];

export const mockSalesData: SalesData[] = [
  { date: 'Jan 8', revenue: 1250.75, transactions: 45, averageOrder: 27.79 },
  { date: 'Jan 9', revenue: 1380.50, transactions: 52, averageOrder: 26.55 },
  { date: 'Jan 10', revenue: 1125.25, transactions: 38, averageOrder: 29.61 },
  { date: 'Jan 11', revenue: 1450.00, transactions: 48, averageOrder: 30.21 },
  { date: 'Jan 12', revenue: 1675.75, transactions: 61, averageOrder: 27.47 },
  { date: 'Jan 13', revenue: 1320.25, transactions: 44, averageOrder: 30.01 },
  { date: 'Jan 14', revenue: 1580.50, transactions: 55, averageOrder: 28.74 },
  { date: 'Jan 15', revenue: 1847.25, transactions: 67, averageOrder: 27.57 }
];

export const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Premium Coffee',
    category: 'Beverages',
    price: 4.50,
    stock: 45,
    lowStockThreshold: 20,
    cost: 2.25,
    supplier: 'Coffee Co.',
    lastRestocked: new Date('2024-01-10T00:00:00')
  },
  {
    id: '2',
    name: 'Green Tea Latte',
    category: 'Beverages',
    price: 5.25,
    stock: 32,
    lowStockThreshold: 15,
    cost: 2.75,
    supplier: 'Tea Masters',
    lastRestocked: new Date('2024-01-12T00:00:00')
  },
  {
    id: '3',
    name: 'Blueberry Muffin',
    category: 'Snacks',
    price: 2.95,
    stock: 3,
    lowStockThreshold: 10,
    cost: 1.25,
    supplier: 'Bakery Fresh',
    lastRestocked: new Date('2024-01-08T00:00:00')
  },
  {
    id: '4',
    name: 'Margherita Pizza',
    category: 'Food',
    price: 18.75,
    stock: 25,
    lowStockThreshold: 8,
    cost: 8.50,
    supplier: 'Pizza Palace',
    lastRestocked: new Date('2024-01-14T00:00:00')
  },
  {
    id: '5',
    name: 'Caesar Salad',
    category: 'Food',
    price: 10.50,
    stock: 18,
    lowStockThreshold: 12,
    cost: 4.75,
    supplier: 'Fresh Greens',
    lastRestocked: new Date('2024-01-13T00:00:00')
  }
];

export const mockDashboardStats: DashboardStats = {
  todayRevenue: 1847.25,
  todayTransactions: 67,
  totalProducts: 20,
  lowStockItems: 2,
  activeUsers: 3,
  averageOrderValue: 27.57
};