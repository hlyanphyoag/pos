import { useMutation } from "@tanstack/react-query"
import { api } from "../api"
import { Product, ProductPayload } from "../../types/pos"
import { ApiErrorResponse } from "../../types"
import { AxiosError } from "axios"

export const useAddProductMutation = () => {
    return useMutation<
    Product,
    AxiosError<ApiErrorResponse>,
    ProductPayload
    >({
         mutationFn: async(product : ProductPayload) => {
            return await api.post('/products', product).then(res => res.data)
         }
    })
}

export const useDeleteProductMutation = () => {
    return useMutation<
    any,
    AxiosError<ApiErrorResponse>,
    string
    >({
        mutationFn: async(productId : string) => {
            return await api.delete(`/products/${productId}`).then(res => res.data)
        }
    })
}

export const useUpdateStockMutation = () => {
    return useMutation<
    Product, 
    AxiosError<ApiErrorResponse>, 
    {productId: string, quantity?: number, price?: number}
    >({
        mutationFn: async({productId, quantity, price}: {productId: string, quantity?: number, price?: number}) => {
            const params: {stock?: number, price?: number} = {}
            if(quantity !== undefined ) {params.stock = quantity}
            if(price !== undefined ) params.price = price
            return await api.patch(`/products/${productId}`, params).then(res => res.data)
        }
    })
}