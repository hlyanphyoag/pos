export const saleQueryKey = {
    getAllSales : (page: number | null, size: number | null, sortBy: string, filterBy: string, startDate: string, endDate: string) => ['sales', page, size, sortBy, filterBy, startDate, endDate]
}