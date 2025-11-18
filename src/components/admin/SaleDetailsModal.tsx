import React from 'react';
import { X, Receipt, User, Calendar, CreditCard, Package } from 'lucide-react';
import { GetSaleApiResponse } from '../../types/pos';
import { format } from 'date-fns';

interface SaleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: GetSaleApiResponse | null;
}

export const SaleDetailsModal: React.FC<SaleDetailsModalProps> = ({
  isOpen,
  onClose,
  sale,
}) => {
  if (!isOpen || !sale) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto 
      [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:my-4 [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500
      ">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <Receipt className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sale Details</h2>
              <p className="text-gray-600 dark:text-gray-400">Transaction #{sale.id.slice(-8)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Sale Information */}
        <div className="space-y-6">
          {/* Date and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {format(new Date(sale.createdAt), "d MMM yyyy, h:mma")}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</span>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                ${sale?.paymentType?.type === "Cash" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"}`}
              >
                {sale?.paymentType?.type}
              </span>
            </div>
          </div>

          {/* Cashier Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User size={18} className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Cashier</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-lg font-medium text-blue-600 dark:text-blue-400">
                  {sale.cashier.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{sale.cashier.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{sale.cashier.email}</p>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package size={18} className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Items Purchased</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-600">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200 text-sm">Product</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-200 text-sm">Quantity</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-200 text-sm">Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-200 text-sm">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {sale.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {item.product?.image && (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{item.product?.name || 'Unknown Product'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SKU: {item.product?.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-900 dark:text-white">
                        x{item.quantity}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                        {item.price} MMK
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                        {(item.price * item.quantity).toLocaleString()} MMK
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 dark:text-blue-400 font-medium text-lg">Total Amount</span>
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {sale.total.toLocaleString()} MMK
              </span>
            </div>
            <div className="flex items-center mt-2 justify-between">
              <span className="text-green-500 dark:text-blue-400 font-medium text-md">Profit</span>
              <span className="text-xl font-bold text-green-500 dark:text-blue-400">
                {sale.profit.toLocaleString()} MMK
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Payment Status</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                sale.paid 
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" 
                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
              }`}>
                {sale.paid ? 'Paid' : 'Unpaid'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
          <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
        </div>
      </div>
    </div>
  );
};
