import { useMutation } from "@tanstack/react-query"
import { api } from "../api"
import { ApiErrorResponse } from "../../types"
import { AxiosError } from "axios"

export const usePaymentInfoMutation = () => {
    return useMutation<
    any,
    AxiosError<ApiErrorResponse>,
    {type: string, imageUrl: string}
    >({
        mutationFn: async(paymentInfo : {type: string, imageUrl: string}) => {
            return await api.post('/payment/types', paymentInfo ).then(res => res.data)
        }
    })
}

export const usePatchPaymentInfoMutation = () => {
    return useMutation<
    any,
    AxiosError<ApiErrorResponse>,
    {type: string, imageUrl: string, isActive: boolean}
    >({
        mutationFn: async(payload: {type: string, imageUrl: string, isActive: boolean}) => {
            return await api.put(`/payment/types/${payload.type}`, payload).then(res => res.data)
        }
    })
}

export const useDeletePaymentInfoMutation = () => {
    return useMutation({
        mutationFn: async(type: string) => {
            return await api.delete(`/payment/types/${type}`).then(res => res.data)
        }
    })
}