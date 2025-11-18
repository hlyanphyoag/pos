import { format } from "date-fns"
import TableSkeleton from "../TableSkeleton"
import { CustomDropDown } from "../CustomDropDown"
import { useTransaction } from "@/hooks/useTransaction"
import Pagination from "../Pagination"
import { FileX2Icon, ListChecksIcon, LucideListFilter, Plus } from "lucide-react"
import { Calendar28 } from "../ui/DatePicker"
import { getTransactionStatsCard } from "@/utils/statCardsConfig"
import { StatCard } from "../StatCard"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import AddTransactionRule from "./AddTransactionRule"
import CurrentTransactionRateModal from "./CurrentTransactionRateModal"
import { formatNumber } from "@/utils/formatNumberHelper"


const Transaction = () => {
  const {
    allTransactions,
    isPending,
    serviceType,
    paymentServiceCategory,
    setPaymentServiceCategory,
    paymentTypeCategory,
    setPaymentTypeCategory,
    currentPage,
    setCurrentPage,
    totalPages,
    addRuleTransactionOpen,
    setAddRuleTransactionOpen,
    filterTypes,
    selectedFilterType,
    setSelectedFilterType
  } = useTransaction()


  const statCards = getTransactionStatsCard(allTransactions?.stats, serviceType?.type)

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Transaction Analytics</h1>
          <div className="flex gap-x-2 mb-4">
            <p className="text-gray-600 dark:text-gray-400">Here's today</p>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${serviceType.service === "WavePay" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"}`}
            >
              {serviceType.service ? serviceType.service : 'KPay'}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${serviceType?.type === "Received" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"}`}
            >
              {serviceType.type ? serviceType.type === 'Received' ? 'Received  (Cash Out)' : 'Transfer' : 'Transfer'}
            </span>
            <p className="text-gray-600 dark:text-gray-400">Lists.</p>
          </div>
        </div>


        <div className="space-x-2">
          <Dialog>
            <DialogTrigger>
              <Button variant='outline'>
                <ListChecksIcon />
                Current Rates</Button>
            </DialogTrigger>
            <CurrentTransactionRateModal />
          </Dialog>

          <Dialog open={addRuleTransactionOpen} onOpenChange={setAddRuleTransactionOpen}>
            <DialogTrigger>
              <Button variant='custom'>
                <Plus size={20} />
                Add Rate</Button>
            </DialogTrigger>
            <AddTransactionRule setOpen={setAddRuleTransactionOpen} />
          </Dialog>

        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-x-4">
        <CustomDropDown
          categories={[
            "KPay",
            "WavePay",
          ]}
          paramName="service"
          selectedCategory={paymentServiceCategory}
          setSelectedCategory={setPaymentServiceCategory}
          origin="transactions"
        />
        <CustomDropDown
          categories={[
            "Transfer",
            "Received",
          ]}
          paramName="type"
          selectedCategory={paymentTypeCategory}
          setSelectedCategory={setPaymentTypeCategory}
          origin="transactions"
          noIcon={true}
        />

        <CustomDropDown
          categories={filterTypes}
          paramName="filterBy"
          selectedCategory={selectedFilterType}
          setSelectedCategory={setSelectedFilterType}
          origin="sales"
          icon={LucideListFilter}
        />

        <div className="w-52">
          <Calendar28 filterBy={serviceType.filterBy} />
        </div>
      </div>




      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-t-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-6">
        {/*Table Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transaction History
          </h3>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-6 font-semibold text-gray-500 dark:text-white">
                  ID
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-500 dark:text-white">
                  Date & Time
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-500 dark:text-white">
                  Receipt
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-500 dark:text-white">
                  Payment method
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-500 dark:text-white">
                  Type
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-500 dark:text-white">
                  Amount
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-500 dark:text-white">
                  Profit
                </th>
              </tr>
            </thead>
            {isPending ? (
              <TableSkeleton />
            ) : !allTransactions?.recentTransactions.length ? (
              <tbody>
                <tr>
                  <td colSpan={7} className="py-4 px-6 text-center">
                    <FileX2Icon className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No transactions found.</p>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 ">
                {allTransactions?.recentTransactions?.map((data) => {
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
                          <div className="text-sm text-gray-900 dark:text-gray-500">
                            {format(
                              new Date(data.createdAt),
                              "d MMM yyyy, h:mma"
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Dialog>
                          <DialogTrigger>
                            <div className="flex items-center">
                              <img src={data.screenshotUrl} alt="" className="h-16 w-20 rounded-md object-contain" />
                            </div>
                          </DialogTrigger>
                          <DialogContent className="h-[550px] overflow-auto">
                            <img src={data.screenshotUrl} alt="" className="w-full" />
                          </DialogContent>
                        </Dialog>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${data?.serviceType === "WavePay" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"}`}
                        >
                          {data?.serviceType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${data?.type === "IN" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"}`}
                        >
                          {data?.type === 'IN' ? 'Received (Cash Out)' : 'Transfer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatNumber(data.quantity)} <span className="text-gray-500 text-xs">MMK</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatNumber(data.revenue)} <span className="text-gray-500 text-xs">MMK</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>

      </div>

      {/*Table Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  )
}

export default Transaction