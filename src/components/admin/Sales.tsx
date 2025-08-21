import React, { useState } from "react";
import {
  Download,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  FileSpreadsheet,
} from "lucide-react";
import { SalesData } from "../../types/admin";
import { useSaleQuery } from "../../services/saleServices/sale.query";
import { format } from "date-fns";
import Pagination from "../Pagination";
import TableSkeleton from "../TableSkeleton";
import { useDashboardStatisticsQuery } from "../../services/DashboardService/dashboard.query";
import { useExcelExport } from "../../hooks/exportToExcel";

interface SalesProps {
  salesData: SalesData[];
}

export const Sales: React.FC<SalesProps> = () => {
  const [openSaleItems, setOpenSaleItems] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isExporting, setIsExporting] = useState(false);

  // Custom hook for Excel export
  const { exportSalesToExcel, exportSalesSummaryToExcel } = useExcelExport();

  const {
    data: saleData,
    isPending,
  } = useSaleQuery(currentPage, itemsPerPage, "createdAt");

  const { data: dashboardStats } = useDashboardStatisticsQuery();

  const totalPages = Math.ceil(saleData?.totalElements! / itemsPerPage);

  console.log("SaleData:", saleData);

  const handleToggle = (id: string) => {
    saleData?.results?.forEach((sale) => {
      if (sale.id === id) {
        setOpenSaleItems(sale.id);
      } else if (id === openSaleItems) {
        setOpenSaleItems(null);
      }
    });
  };

  // Handle Excel export
  const handleExport = async () => {
    if (!saleData?.results || saleData.results.length === 0) {
      alert('No sales data available to export');
      return;
    }

    setIsExporting(true);
    
    try {
      // Export detailed sales data
      exportSalesSummaryToExcel(
        saleData.results,
        dashboardStats,
        'sales-report'
      );
      
      // Show success message
      alert('Sales data exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle simple export (current page only)
  const handleQuickExport = async () => {
    if (!saleData?.results || saleData.results.length === 0) {
      alert('No sales data available to export');
      return;
    }

    setIsExporting(true);
    
   setTimeout(() => {
    try {
      exportSalesToExcel(saleData.results, 'sales-current-page');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }finally{
        setIsExporting(false);
    }
   }, 1000)
  };

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
      title: "Avg Order Value",
      value: `${dashboardStats?.avgOrderValue} MMK`,
      icon: TrendingUp,
      change: "+3.4%",
      positive: true,
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="space-y-6 dark:text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sales Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your sales performance and trends
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Quick Export Button */}
          <button 
            onClick={handleQuickExport}
            disabled={isExporting || isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
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

      {/* Detailed Sales Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sales History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-6 font-semibold text-gray-500 dark:text-white">
                  Sale ID
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-500 dark:text-white">
                  Date & Time
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-500 dark:text-white">
                  Cashier
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-500 dark:text-white">
                  Items
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-500 dark:text-white">
                  Total
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-500 dark:text-white">
                  Payment method
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-500 dark:text-white">
                  Status
                </th>
              </tr>
            </thead>
            {isPending ? (
              <TableSkeleton />
            ) : (
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {saleData?.results?.map((data) => {
                  return (
                    <tr
                      key={data.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          #{data.id.slice(-8)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {format(
                              new Date(data.createdAt),
                              "d MMM yyyy, h:mma"
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {data.cashier.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {data.cashier.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex flex-col items-center">
                        <div>
                          <span className="inline-flex items-center px-2.5  rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                            {data.items.length} item
                            {data.items.length !== 1 ? "s" : ""}
                          </span>
                          <button onClick={() => handleToggle(data.id)}>
                            <ChevronDown
                              size={14}
                              className={
                                openSaleItems && openSaleItems === data.id
                                  ? "rotate-180 ml-2"
                                  : "ml-2"
                              }
                            />
                          </button>
                        </div>
                        {openSaleItems &&
                          openSaleItems === data?.id &&
                          data?.items?.map((item) => (
                            <div key={item?.id} className="mt-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {item?.product?.name}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {!item?.product?.name ? "" : `x${item?.quantity}` }
                                </span>
                              </div>
                            </div>
                          ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {data.total} MMK
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${data?.paymentType?.type === "Cash" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"}`}
                        >
                          {data?.paymentType?.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                          {data.paid ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};