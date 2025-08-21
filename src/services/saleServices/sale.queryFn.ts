import { api } from "../api"

export const saleQueryFn = (page: number | null, size: number | null, sortBy: string) => {
    const params = {
        page,
        size,
        sortBy,
    }
    return api.get('/sales', {params}).then(res => res.data)
}