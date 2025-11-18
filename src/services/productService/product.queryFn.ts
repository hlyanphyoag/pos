import { api } from "../api"

export const productQueryFn = async (page: number | null, size: number | null, searchByKeyword: string | null, searchByCategory: string | null, sortBy: string | null) => {
    const params = {
        page: searchByKeyword ? null : page,
        size,
        keyword: searchByKeyword || '',
        category: searchByCategory || null,
        sortBy: sortBy || ''
    }
    return await api.get('/products', {params}).then(res => res.data)
}

export const lowStockProductQuery  = async() => {
    return await api.get('/dashboard/inventory/low-stock').then(res => res.data)
}

export const productQueryFnBySku = async(sku: string) => {
    return await api.get(`/products/${sku}`).then(res => res.data)
}

export const productQueryFnCategories = async() => {
    return await api.get('/products/categories').then(res => res.data)
}