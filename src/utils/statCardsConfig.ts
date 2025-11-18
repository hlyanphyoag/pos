import { SaleApiResponse } from '@/types/pos';
import { TransactionStats } from '@/types/transaction';
import { stat } from 'fs';
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  Users,
  TrendingUp,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSignIcon,
} from 'lucide-react';

interface DashboardStats {
  todayRevenue?: number;
  totalTransactions?: number;
  totalProducts?: number;
  lowStockCount?: number;
  activeUsers?: number;
  avgOrderValue?: number;
}

export const getDashboardStatCards = (stats: DashboardStats | undefined) => [
  {
    title: "Today's Revenue",
    value: `${stats?.todayRevenue} MMK`,
    icon: DollarSign,
    change: '+12.5%',
    positive: true,
    color: 'bg-green-500',
  },
  {
    title: 'Transactions',
    value: stats?.totalTransactions,
    icon: ShoppingCart,
    change: '+8.2%',
    positive: true,
    color: 'bg-blue-500',
  },
  {
    title: 'Products',
    value: stats?.totalProducts,
    icon: Package,
    change: '+2.1%',
    positive: true,
    color: 'bg-purple-500',
  },
  {
    title: 'Low Stock Items',
    value: stats?.lowStockCount?.toString(),
    icon: AlertTriangle,
    change: '-5.3%',
    positive: false,
    color: 'bg-orange-500',
  },
  {
    title: 'Active Users',
    value: stats?.activeUsers,
    icon: Users,
    change: '+15.7%',
    positive: true,
    color: 'bg-indigo-500',
  },
  {
    title: 'Avg Order Value',
    value: `${stats?.avgOrderValue} MMK`,
    icon: TrendingUp,
    change: '+3.4%',
    positive: true,
    color: 'bg-emerald-500',
  },
];

export const getSalesStatCards = (stats: SaleApiResponse | undefined) => [
  {
    title: "Total Sales",
    value: `${stats?.totalTransactions  ?? 0}`,
    icon: DollarSign,
    change: '+12.5%',
    positive: true,
    color: 'bg-green-500',
  },
  {
    title: "Total Sales Amount",
    value: stats?.totalRevenue ?? 0,
    icon: ShoppingCart,
    change: '+8.2%',
    positive: true,
    color: 'bg-blue-500',
    moneyOrNot: true
  },
  {
    title: 'Total Sales Profits',
    value: stats?.totalProfit ?? 0,
    icon: TrendingUp,
    change: '+3.4%',
    positive: true,
    color: 'bg-emerald-500',
    moneyOrNot: true
  },
];

export const getTransactionStatsCard = (stats: TransactionStats | undefined, type: string | undefined) => {
  const Icon = type === 'Received' ? ArrowDownLeft : ArrowUpRight;
  return [
    {
      title: "Total Transactions",
      value: `${stats?.serviceTypeBreakdown[0]?.count ? stats?.serviceTypeBreakdown[0]?.count : 0}`,
      icon: Wallet,
      change: '+12.5%',
      positive: true,
      color: 'bg-blue-500',
    },
    {
      title: `Today's ${type ? type : 'Transfer'} Amount`,
      value: `${stats?.serviceTypeBreakdown[0]?.totalAmount ? stats?.serviceTypeBreakdown[0]?.totalAmount : 0}`,
      icon: Icon,
      change: '+12.5%',
      positive: true,
      color: 'bg-emerald-500',
      moneyOrNot: true
    },
    {
      title: `Today's ${type ? type : 'Transfer'} Profit`,
      value: `${stats?.serviceTypeBreakdown[0]?.totalRevenue ? stats?.serviceTypeBreakdown[0]?.totalRevenue : 0 }`,
      icon: DollarSignIcon,
      change: '+12.5%',
      positive: true,
      color: 'bg-green-500',
      moneyOrNot: true
    },
  ]
}