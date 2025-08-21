import { useQuery } from "@tanstack/react-query"
import { paymentQueryKey } from "./payment.queryKey"
import { getAllPaymetInfoFn, getOnePaymentInfoFn } from "./payment.queryFn"
import { PaymentInfoType } from "../../types/pos"

export const useGetAllPaymentQuery = () => {
    return useQuery<PaymentInfoType[]>({
        queryKey: paymentQueryKey.getAllPaymentQueryKey(),
        queryFn: getAllPaymetInfoFn
    })
}

export const useGetOnePaymentQuery = (type : string) => {
   return useQuery({
    queryKey: paymentQueryKey.getOnePaymentQueryKey(type),
    queryFn: () => getOnePaymentInfoFn(type)
   })
}