import { useQuery } from "@tanstack/react-query"
import { TransactionQueryKey } from "./transaction.queryKey"
import { getAllTransactionFn, getAllTransactionRatesFn } from "./transaction.queryFn"
import { GetAllTransactionRate, TranscationResponse } from "../../types/transaction"


export const useGetAllTransactionsQuery = (page: string, size: string, serviceType: string, type: string, startDate: string, endDate: string) => {
    return useQuery<
        TranscationResponse
    >({
        queryKey: TransactionQueryKey.getAllTrasactions(page, size, serviceType, type, startDate, endDate),
        queryFn: () => getAllTransactionFn(page, size, serviceType, type, startDate, endDate)
    })
}

export const useGetAllTransactionRatesQuery = (serviceType: string, inOutType: string) => {
    return useQuery<
        GetAllTransactionRate
    >({
        queryKey: TransactionQueryKey.getAllTransactionRates(serviceType, inOutType),
        queryFn: () => getAllTransactionRatesFn(serviceType, inOutType)
    })
}