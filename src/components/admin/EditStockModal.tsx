import React, { useState, useEffect } from "react";
import { X, Package, AlertCircle, Plus, Minus } from "lucide-react";
import { Product } from "../../types/pos";

interface EditStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStock: (id: string, newStock: number, reason: string) => void;
  onPriceEdit: (id: string, price: number) => void;
  isPending: boolean;
  item: Product | null;
}

export const EditStockModal: React.FC<EditStockModalProps> = ({
  isOpen,
  onClose,
  onUpdateStock,
  onPriceEdit,
  isPending,
  item,
}) => {
  const [stockChange, setStockChange] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [changeType, setChangeType] = useState<"add" | "subtract" | "set">(
    "add"
  );
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && item) {
      setStockChange("");
      setChangeType("add");
      setReason("");
      setErrors({});
    }
  }, [isOpen, item]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (changeType !== "set" && (!stockChange || parseInt(stockChange) <= 0)) {
      newErrors.stockChange = "Valid quantity is required";
    }
    if (changeType !== "set" && !reason.trim()) {
      newErrors.reason = "Reason is required";
    }

    const change = parseInt(stockChange) || 0;
    if (changeType === "subtract" && item && change > item.stock) {
      newErrors.stockChange = "Cannot subtract more than current stock";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateNewStock = () => {
    if (!item || !stockChange) return item?.stock || 0;

    const change = parseInt(stockChange) || 0;
    switch (changeType) {
      case "add":
        return item.stock + change;
      case "subtract":
        return Math.max(0, item.stock - change);
      case "set":
        return parseInt(stockChange) || 0;
      default:
        return item.stock;
    }
  };

  // const calculateNewPrice = () => {
  //   if (!item ||!newPrice) return item?.price || 0;
  //   const inputPrice = parseFloat(newPrice) || 0;
  //   return item.price + inputPrice;
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newStock = calculateNewStock();
      const fullReason = `${changeType === "add" ? "Added" : changeType === "subtract" ? "Removed" : "Set to"} ${stockChange} units - ${reason}`;
      changeType === "set"
        ? onPriceEdit(item.id, parseInt(newPrice))
        : onUpdateStock(item.id, newStock, fullReason);
    } catch (error) {
      console.error("Error updating stock:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "stockChange") {
      setStockChange(value);
    } else if (field === "newPrice") {
      setNewPrice(value);
    } else if (field === "reason") {
      setReason(value);
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const quickReasons = [
    "Inventory recount",
    "Received shipment",
    "Damaged goods",
    "Expired items",
    "Customer return",
    "Theft/Loss",
    "Promotional use",
  ];

  if (!isOpen || !item) return null;

  const newStock = calculateNewStock();

  console.log("NewStock:", newStock);
  console.log("stockChange:", stockChange);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit {changeType === "set" ? "Price" : "Stock"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{item.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Current Stock Info */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {changeType !== "set" ? "Current Stock" : "Current Price"}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {changeType !== "set"
                  ? item.stock + "units"
                  : item.price + " MMK"}{" "}
              </p>
            </div>
            {changeType !== "set" && (
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Low Stock Alert
                </p>
                <p className="text-lg font-semibold text-orange-600">
                  {10} units
                </p>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Change Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Stock Operation
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setChangeType("add")}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                  changeType === "add"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Plus size={20} />
                <span className="text-sm font-medium">Add</span>
              </button>
              <button
                type="button"
                onClick={() => setChangeType("subtract")}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                  changeType === "subtract"
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Minus size={20} />
                <span className="text-sm font-medium">Remove</span>
              </button>
              <button
                type="button"
                onClick={() => setChangeType("set")}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                  changeType === "set"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Package size={20} />
                <span className="text-sm font-medium">Set To</span>
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {changeType === "set" ? "New Price" : "Quantity"} *
            </label>
            <input
              type="number"
              min="1"
              value={changeType !== "set" ? stockChange : newPrice}
              onChange={(e) =>
                handleInputChange(
                  changeType === "set" ? "newPrice" : "stockChange",
                  e.target.value
                )
              }
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center text-xl font-semibold ${
                errors.stockChange
                  ? "border-red-500"
                  : "border-gray-200 dark:border-gray-600"
              }`}
              placeholder="0"
            />
            {errors.stockChange && (
              <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400">
                <AlertCircle size={16} />
                <span className="text-sm">{errors.stockChange}</span>
              </div>
            )}
          </div>

          {/* New Stock Preview */}
          {(stockChange || newPrice) && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-700 dark:text-blue-400 font-medium">
                  {changeType === "set" ? "New Price" : "New Stock Level"}
                </span>
                <span
                  className={`text-xl font-bold ${
                    newStock <= 10
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-blue-700 dark:text-blue-400"
                  }`}
                >
                  {changeType === "set"
                    ? newPrice + " MMK"
                    : newStock + " units"}
                </span>
              </div>
              {newStock <= 10 && (
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                  ⚠️ This will trigger a low stock alert
                </p>
              )}
            </div>
          )}

          {/* Reason */}
          {changeType !== "set" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason *
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.reason
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                }`}
                placeholder="Enter reason for stock change"
              />
              {errors.reason && (
                <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400">
                  <AlertCircle size={16} />
                  <span className="text-sm">{errors.reason}</span>
                </div>
              )}

              {/* Quick Reasons */}
              <div className="mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Quick reasons:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickReasons.map((quickReason) => (
                    <button
                      key={quickReason}
                      type="button"
                      onClick={() => setReason(quickReason)}
                      className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
                    >
                      {quickReason}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isSubmitting || isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  {/* <Save size={20} /> */}
                  Update {changeType === "set" ? "Price" : "Stock"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
