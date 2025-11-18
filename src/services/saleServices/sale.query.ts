import { useQuery } from "@tanstack/react-query"
import { saleQueryKey } from "./sale.queryKey"
import { saleQueryFn } from "./sale.queryFn"
import { SaleApiResponse } from "../../types/pos"

export const useSaleQuery = (page: number | null, size: number | null, sortBy: string, filterBy: string, startDate: string, endDate: string) => {
    return useQuery<SaleApiResponse>({
        queryKey: saleQueryKey.getAllSales(page, size, sortBy, filterBy, startDate, endDate),
        queryFn: () => saleQueryFn(page, size, sortBy, filterBy, startDate, endDate),
    })
}