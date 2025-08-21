import { api } from "../api"

export const dashboardQueryFn = async() => {
    return await api.get('/dashboard/stats').then(res => res.data)
}

export const dashboardSalesQueryFn = async() => {
    return await api.get('/dashboard/sales/overview').then(res => res.data)
}

export const dashboardRecentActivityQueryFn = async() => {
   return await api.get('/dashboard/activity/recent?limit=5').then(res => res.data) 
}