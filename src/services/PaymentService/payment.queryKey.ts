export const paymentQueryKey = {
    getAllPaymentQueryKey: () => ['payment'],
    getOnePaymentQueryKey: (type: string) => ['payment', type]
}