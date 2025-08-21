export const productQueryKey = {
    getProductCategories: () => ['product', 'categories'],
    getAllProducts:(page: number | null, size: number | null, searchByKeyword: string, searchByCategory: string | null, sortBy: string) => ['products', page, size, searchByKeyword, searchByCategory, sortBy],
    getProductBySku: (sku : string) => ['product', sku],
}