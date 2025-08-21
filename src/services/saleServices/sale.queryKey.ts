export const saleQueryKey = {
    getAllSales : (page: number | null, size: number | null, sortBy: string) => ['sales', page, size, sortBy]
}