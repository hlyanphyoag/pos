import { useQuery } from "@tanstack/react-query"
import { productQueryKey } from "./product.queryKey"
import { lowStockProductQuery, productQueryFn, productQueryFnBySku, productQueryFnCategories } from "./product.queryFn"
import { ProductApiResponse, ProductLowStock } from "../../types/pos"


export const useProductCategoriesQuery = () => {
    return useQuery({
        queryKey: productQueryKey.getProductCategories(),
        queryFn: productQueryFnCategories
    })
}

export const useProductQuery = (page: number | null, size: number | null, searchByKeyword: string, searchByCategory: string | null, sortBy: string) => {
    return useQuery<ProductApiResponse>({
        queryKey: productQueryKey.getAllProducts(page, size, searchByKeyword, searchByCategory, sortBy),
        queryFn:() =>  productQueryFn(page, size, searchByKeyword, searchByCategory, sortBy)
    })
}

export const useLowStockQuery = () => {
    return useQuery<ProductLowStock>({
        queryKey: ['low-stock'],
        queryFn: lowStockProductQuery
        }
    )
}

export const useProductQueryBySku = (sku: string) => {
    return useQuery({
        queryKey: productQueryKey.getProductBySku(sku),
        queryFn: () => productQueryFnBySku(sku),
        enabled: !!sku
    })
}
