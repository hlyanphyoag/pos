export const TransactionQueryKey = {
    getAllTrasactions: (page : string, size : string, serviceType: string, type: string, startDate: string, endDate: string) => ['transactions', page, size, serviceType, type, startDate, endDate],
    getAllTransactionRates: (serviceType: string, inOutType: string) => ['transaction-rates', serviceType, inOutType]
}
