import {
  useDashboardRecentActivityQuery,
  useDashboardSalesDataQuery,
  useDashboardStatisticsQuery,
} from "../../services/DashboardService/dashboard.query";
import SalesOverviewChart from "./SalesLineChart";
import DashboardSkeleton from "../DashboardSkeleton";
import { StatCard } from "../StatCard";
import { getDashboardStatCards } from "../../utils/statCardsConfig";
import { getActivityConfig } from "../../utils/activityHelpers";

export const Dashboard = () => {
  const { data: dashboardStats, isPending: dashboardPending } = useDashboardStatisticsQuery();
  const { data: dashboardSalesData, isPending: dashboardSalesPending } = useDashboardSalesDataQuery();
  const { data: dashboardRecentActivityData, isPending: dashboardRecentActivityPending } = useDashboardRecentActivityQuery();

  const statCards = getDashboardStatCards(dashboardStats);

  if (dashboardPending || dashboardSalesPending || dashboardRecentActivityPending) {
    return <DashboardSkeleton />;
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
          <StatCard key={index} {...stat} />
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
            {dashboardRecentActivityData?.map((activity, index) => {
              const config = getActivityConfig(activity.type as any);
              const Icon = config.icon;
              
              return (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${config.bgColor}`}>
                  <div className={`w-8 h-8 ${config.iconBgColor} rounded-full flex items-center justify-center`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{config.label}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
