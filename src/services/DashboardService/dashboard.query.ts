import { useQuery } from "@tanstack/react-query"
import { dashboardQueryKey } from "./dashboard.queryKey"
import { dashboardQueryFn, dashboardRecentActivityQueryFn, dashboardSalesQueryFn } from "./dashboard.queryFn"
import { DashboardRecentActivity, DashboardSales, DashboardStats } from "../../types/pos"

export const useDashboardStatisticsQuery = () => {
    return useQuery<DashboardStats>({
        queryKey: dashboardQueryKey.getDashboardStatistics(),
        queryFn: dashboardQueryFn
    })
}

export const useDashboardSalesDataQuery = () => {
    return useQuery<DashboardSales[]>({
        queryKey: dashboardQueryKey.getDashboardSalesData(),
        queryFn: dashboardSalesQueryFn
    })
}

export const useDashboardRecentActivityQuery = () => {
    return useQuery<DashboardRecentActivity[]>({
        queryKey: dashboardQueryKey.getDashboardRecentActivity(),
        queryFn: dashboardRecentActivityQueryFn
    })
}