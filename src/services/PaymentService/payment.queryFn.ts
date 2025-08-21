import { api } from "../api"

export const getAllPaymetInfoFn = async() => {
    const params = {
        includeInactive: true
    }
    return await api.get("/payment/types", {params}).then(res => res.data)
}

export const getOnePaymentInfoFn = async(type : string) => {
    return await api.get(`/payment/types/${type}`).then(res => res.data)
}