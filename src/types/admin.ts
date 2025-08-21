export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
  status: 'active' | 'inactive';
  lastLogin?: Date;
  createdAt: Date;
}

export interface SalesData {
  date: string;
  revenue: number;
  transactions: number;
  averageOrder: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  cost: number;
  supplier?: string;
  lastRestocked?: Date;
  image?: string;
  barcode?: string;
}

// export interface DashboardStats {
//   todayRevenue: number;
//   todayTransactions: number;
//   totalProducts: number;
//   lowStockItems: number;
//   activeUsers: number;
//   averageOrderValue: number;
// }

export type AdminView = 'dashboard' | 'inventory' | 'sales' | 'users' | 'settings';