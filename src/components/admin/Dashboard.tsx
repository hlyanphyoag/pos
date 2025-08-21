import React from "react";
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  Users,
  TrendingUp,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { DashboardStats, SalesData } from "../../types/admin";
import {
  useDashboardRecentActivityQuery,
  useDashboardSalesDataQuery,
  useDashboardStatisticsQuery,
} from "../../services/DashboardService/dashboard.query";
import SalesOverviewChart from "./SalesLineChart";
import DashboardSkeleton from "../DashboardSkeleton";

interface DashboardProps {
  stats: DashboardStats;
  salesData: SalesData[];
}

export const Dashboard: React.FC<DashboardProps> = () => {
  const { data: dashboardStats, isPending: dashboardPending } =
    useDashboardStatisticsQuery();
  console.log("DashboardStats:", dashboardStats);
  const { data: dashboardSalesData, isPending: dashboardSalesPending } =
    useDashboardSalesDataQuery();

  const {
    data: dashboardRecentActivityData,
    isPending: dashboardRecentActivityPending,
  } = useDashboardRecentActivityQuery();

  console.log("DashboardSalesData:", dashboardSalesData);
  console.log("DashboardRecentActivityData:", dashboardRecentActivityData);

  const statCards = [
    {
      title: "Today's Revenue",
      value: `${dashboardStats?.todayRevenue} MMK`,
      icon: DollarSign,
      change: "+12.5%",
      positive: true,
      color: "bg-green-500",
    },
    {
      title: "Transactions",
      value: dashboardStats?.totalTransactions,
      icon: ShoppingCart,
      change: "+8.2%",
      positive: true,
      color: "bg-blue-500",
    },
    {
      title: "Products",
      value: dashboardStats?.totalProducts,
      icon: Package,
      change: "+2.1%",
      positive: true,
      color: "bg-purple-500",
    },
    {
      title: "Low Stock Items",
      value: dashboardStats?.lowStockCount.toString(),
      icon: AlertTriangle,
      change: "-5.3%",
      positive: false,
      color: "bg-orange-500",
    },
    {
      title: "Active Users",
      value: dashboardStats?.activeUsers,
      icon: Users,
      change: "+15.7%",
      positive: true,
      color: "bg-indigo-500",
    },
    {
      title: "Avg Order Value",
      value: `${dashboardStats?.avgOrderValue} MMK`,
      icon: TrendingUp,
      change: "+3.4%",
      positive: true,
      color: "bg-emerald-500",
    },
  ];

  if(dashboardPending || dashboardSalesPending || dashboardRecentActivityPending) {
    return (
      <DashboardSkeleton />
    )
  }

  return (
    <div className="space-y-6 dark:text-white">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <stat.icon className="text-white" size={24} />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.positive ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.positive ? (
                  <ArrowUp size={16} />
                ) : (
                  <ArrowDown size={16} />
                )}
                {stat.change}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <SalesOverviewChart dashboardSalesData={dashboardSalesData!} />

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {dashboardRecentActivityData?.map((activity, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 dark:bg-green-900/20 rounded-lg ${activity.type === "SALE_COMPLETED" ? "bg-blue-50" :  activity.type === "USER_ADDED" ? "bg-green-50" : "bg-red-50"}`}
              >
                <div className={`w-8 h-8 ${activity.type === "SALE_COMPLETED" ? "bg-blue-500" :  activity.type === "USER_ADDED" ? "bg-green-500" : "bg-red-300"} rounded-full flex items-center justify-center`}>
                  {
                    activity.type === "SALE_COMPLETED"? (
                      <DollarSign size={16} className="text-white" />
                    ) : activity.type === "INVENTORY_UPDATED"? (
                      <Package size={16} className="text-white" />
                    ) : activity.type === "LOW_STOCK_ALERT"? (
                      <AlertTriangle size={16} className="text-white" />
                    ) : activity.type === "USER_ADDED"? (
                      <Users size={16} className="text-white" />
                    ) : (
                      <DollarSign size={16} className="text-white" />
                    )
                  }
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.type === "SALE_COMPLETED"? "Sale Completed" :  activity.type === "INVENTORY_UPDATED"? "Inventory Updated" : activity.type === "LOW_STOCK_ALERT"? "Low Stock Alert" : activity.type === "USER_ADDED"? "User Added" : "Sale Completed"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {activity.description}
                  </p>
                </div>

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </div>
            ))}

            {/* <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Package size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Inventory updated</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Premium Coffee restocked</p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">15 min ago</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <AlertTriangle size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Low stock alert</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Blueberry Muffin (3 left)</p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Users size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">New user added</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Sarah Johnson (Cashier)</p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">3 hours ago</span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
