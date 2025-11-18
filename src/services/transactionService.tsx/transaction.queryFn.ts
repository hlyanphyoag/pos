import { api } from "../api"


export const getAllTransactionFn = async(page : string, size : string, serviceType: string, type: string, startDate: string, endDate: string) => {
    const params  = {
        page,
        size,
        serviceType,
        type,
        startDate,
        endDate
    }
    return await api.get('money-inout/admin/overview', {params}).then(res => res.data)
}

export const getAllTransactionRatesFn = async(serviceType: string, inOutType: string) => {
    const params = {
        serviceType,
        inOutType
    }
    return await api.get('revenue-rules', {params}).then(res => res.data)
}