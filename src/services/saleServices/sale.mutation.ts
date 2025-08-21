import { useMutation } from "@tanstack/react-query"
import { api } from "../api"
import { SaleApiResponse, SalePayload } from "../../types/pos"
import { ApiErrorResponse } from "../../types"
import { AxiosError } from "axios"

export const useSaleMutationQuery = () => {
    return useMutation<
     SaleApiResponse,
     AxiosError<ApiErrorResponse>,
     {payload: SalePayload}
    >({
        mutationFn: async({payload} : {payload: SalePayload}) => {
            return await api.post('/sales', payload).then(res => res.data)
        }
    })
}