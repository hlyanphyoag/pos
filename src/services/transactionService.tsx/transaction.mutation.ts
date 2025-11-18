import { useMutation } from "@tanstack/react-query"
import { api } from "../api"
import { AxiosError } from "axios"
import { ApiErrorResponse } from "../../types"
import { RevenueRate, SetRevenueRate, TransactionPayload } from "../../types/transaction"

export const useTransactionMutation = () => {
    return useMutation<
    any,
    AxiosError<ApiErrorResponse>,
    TransactionPayload
    >
    ({
        mutationFn: async(payload: TransactionPayload) => {
            return await api.post('/money-inout', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => res.data)
        }
    })
}

export const useSetTransactionRateMutation = () => {
    return useMutation<
    RevenueRate,
    AxiosError<ApiErrorResponse>,
    SetRevenueRate
    >({
        mutationFn: async(payload: SetRevenueRate) => {
            return await api.post('/revenue-rules', payload).then(res => res.data)
        }
    })
}

export const useDeleteTransactionRateMutation = () => {
    return useMutation<
    any,
    AxiosError<ApiErrorResponse>,
    string
    >({
        mutationFn: async(id: string) => {
            return await api.delete(`/revenue-rules/${id}`).then(res => res.data)
        }
    })
}