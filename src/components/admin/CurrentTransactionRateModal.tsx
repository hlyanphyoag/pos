import { useTransaction } from "@/hooks/useTransaction"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { AlertCircle, FileX2Icon, Trash2Icon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"


const CurrentTransactionRateModal = () => {
    const {
        allTransactionRates,
        isPendingRates,
        updateFilter,
        rateFilter: filter,
        formatNumber,
        deleteRateLoading,
        handleTransactionRateDelete
    } = useTransaction()


    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Current Rates</DialogTitle>
                <DialogDescription>
                    All of your transaction rates.
                </DialogDescription>
            </DialogHeader>

            <div className="flex gap-2 border-b-[1px] py-4">
                {/* ServiceTypeSelect */}
                <Select value={filter.serviceType} onValueChange={(val: string) => updateFilter('serviceType', val)}>
                    <SelectTrigger id="serviceType">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="KPay">KPay</SelectItem>
                        <SelectItem value="WavePay">WavePay</SelectItem>
                    </SelectContent>
                </Select>

                {/* TypeSelect */}
                <Select value={filter.type} onValueChange={(val: string) => updateFilter('type', val)}>
                    <SelectTrigger id="type">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="IN">Received (Cash Out)</SelectItem>
                        <SelectItem value="OUT">Transfer</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                {isPendingRates && <div>Loading...</div>}
                <div className="flex gap-x-2">
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${filter?.serviceType === "WavePay" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"}`}
                    >
                        {filter?.serviceType}
                    </span>
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${filter?.type === "IN" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"}`}
                    >
                        {filter?.type === 'IN' ? 'Received  (Cash Out)' : 'Transfer'}
                    </span>
                    <p className="text-gray-600">rates are...</p>
                </div>

                <div className="mt-4">
                    {allTransactionRates?.rules.length === 0 && (
                        <div>
                            <FileX2Icon className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
                            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">No rates found!</p>
                        </div>
                    )}
                    {allTransactionRates?.rules.map((rule) => (
                        <div key={rule.id} className="flex justify-between items-center mb-2 border-[1px] border-gray-300 p-2 rounded-xl">
                            <div className="flex items-end">
                                <p className="font-medium text-sm text-gray-700 mr-2">
                                    {rule.operator === 'GTE' ? 'Over' : rule.operator === 'LT' ? 'Under' : 'Between'}
                                </p>
                                <span className="text-sm text-gray-600 font-medium">{formatNumber(rule.value)}</span>
                                <span className="text-sm ml-1 text-gray-500">mmk </span>
                                {rule.secondValue !== 0 && (
                                    <>
                                        <span className="text-sm text-gray-600 font-medium"> &nbsp;and {formatNumber(rule.value)}</span>
                                        <span className="text-sm ml-1 text-gray-500">mmk</span>
                                    </>
                                )}
                                <span className="ml-2 text-sm text-gray-700 font-medium">{" = " + rule.percentage} %</span>
                            </div>
                            <Popover>
                                <PopoverTrigger>
                                    {deleteRateLoading ? 
                                    (<div className='w-4 h-4 rounded-full border-2 border-t-transparent animate-spin'></div>)
                                    : (<AlertCircle size={18} className="text-orange-600" />)}
                                </PopoverTrigger>
                                <PopoverContent className="w-full border-0 p-0" align="end">
                                    <Button variant='outline' onClick={()=> handleTransactionRateDelete(rule.id)}>
                                        <Trash2Icon size={15} className="text-red-500" />
                                        <p className="text-xs text-red-500">Delete</p>
                                    </Button>
                                </PopoverContent>
                            </Popover>
                        </div>
                    ))}
                </div>
            </div>
        </DialogContent>
    )
}

export default CurrentTransactionRateModal