import { DollarSign, Package, AlertTriangle, Users, LucideIcon } from 'lucide-react';

type ActivityType = 'SALE_COMPLETED' | 'INVENTORY_UPDATED' | 'LOW_STOCK_ALERT' | 'USER_ADDED';

interface ActivityConfig {
  label: string;
  bgColor: string;
  iconBgColor: string;
  icon: LucideIcon;
}

export const getActivityConfig = (type: ActivityType): ActivityConfig => {
  const configs: Record<ActivityType, ActivityConfig> = {
    SALE_COMPLETED: {
      label: 'Sale Completed',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconBgColor: 'bg-blue-500',
      icon: DollarSign,
    },
    INVENTORY_UPDATED: {
      label: 'Inventory Updated',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconBgColor: 'bg-purple-500',
      icon: Package,
    },
    LOW_STOCK_ALERT: {
      label: 'Low Stock Alert',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconBgColor: 'bg-red-500',
      icon: AlertTriangle,
    },
    USER_ADDED: {
      label: 'User Added',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconBgColor: 'bg-green-500',
      icon: Users,
    },
  };

  return configs[type] || configs.SALE_COMPLETED;
};
