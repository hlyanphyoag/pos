import { Download, ChevronDown, ArrowRightCircle, FileX2Icon } from "lucide-react";
import { SalesData } from "../../types/admin";
import { format } from "date-fns";
import Pagination from "../Pagination";
import TableSkeleton from "../TableSkeleton";
import { StatCard } from "../StatCard";
import { CustomDropDown } from "../CustomDropDown";
import { SaleDetailsModal } from "./SaleDetailsModal";
import useSales from "@/hooks/useSales";
import { Calendar28 } from "../ui/DatePicker";
import { formatNumber } from "@/utils/formatNumberHelper";

interface SalesProps {
  salesData: SalesData[];
}

export const Sales: React.FC<SalesProps> = () => {
  const {
    saleData,
    isPending,
    totalPages,
    statCards,
    setCurrentPage,
    currentPage,
    handleToggle,
    handleQuickExport,
    isExporting,
    isModalOpen,
    selectedSale,
    handleCloseModal,
    handleViewDetails,
    openSaleItems,
    filterTypes,
    selectedFilterType,
    setSelectedFilterType,
    serviceType
  } = useSales()

  return (
    <div className=" dark:text-white">
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
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
            <CustomDropDown
              categories={filterTypes}
              paramName="filterBy"
              selectedCategory={selectedFilterType}
              setSelectedCategory={setSelectedFilterType}
              origin="sales"
            />
            <Calendar28 filterBy={serviceType.filterBy}/>
          </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Detailed Sales Table */}
      <div className="bg-white mb-4 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-6">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sales History
          </h3>
        </div>

        {/* Table  */}
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
                  Profit
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
            ) : !saleData?.results?.length ? (
              <tbody>
                <tr>
                  <td colSpan={7} className="py-4 px-6 text-center">
                    <FileX2Icon className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No Sales found.</p>
                  </td>
                </tr>
              </tbody>
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
                                  {!item?.product?.name
                                    ? ""
                                    : `x${item?.quantity}`}
                                </span>
                              </div>
                            </div>
                          ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatNumber(data?.total)} <span className="text-gray-500 text-xs">MMK</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatNumber(data?.profit)} <span className="text-gray-500 text-xs">MMK</span>
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
                        <button
                          onClick={() => handleViewDetails(data)}
                          className="hover:scale-110 transition-transform"
                        >
                          <ArrowRightCircle size={25} className="text-blue-500 hover:text-blue-600" />
                        </button>
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

      {/* Sale Details Modal */}
      <SaleDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        sale={selectedSale}
      />
    </div>
  );
};
