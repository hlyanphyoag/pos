import { api } from "../api"

export const saleQueryFn = (page: number | null, size: number | null, sortBy: string, filterBy: string, startDate: string, endDate: string) => {
    const params = {
        page,
        size,
        sortBy,
        filterBy,
        startDate,
        endDate
    }
    return api.get('/sales', {params}).then(res => res.data)
}

