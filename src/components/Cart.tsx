import React, { useEffect } from "react";
import { CartItem } from "../types";
import { Minus, Plus, X, ShoppingCart, CreditCard } from "lucide-react";
import { useCartSocket } from "../services/socketService";
import { useAuth } from "../hooks/useAuth";

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  subtotal: number;
  tax: number;
  total: number;
}

export const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  subtotal,
  tax,
  total,
}) => {
  const { authState } = useAuth();
  const userId = authState?.user?.id;
  const { emitCartUpdate } = useCartSocket(userId || "");
  console.log("Items On Cart:", items);

  useEffect(() => {
    emitCartUpdate(items, subtotal, tax, total);
  }, [items, subtotal, tax, total, emitCartUpdate]);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Cart</h2>
        </div>
        <div className="text-center text-gray-500 py-8">
          <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
          <p>Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="text-blue-600" size={24} />
        <h2 className="text-xl font-bold text-gray-900">
          Cart ({items.length})
        </h2>
      </div>

      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{item.name}</h4>
              <p className="text-sm text-gray-500">{item.price} MMK each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))
                }
                className="p-1 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="p-1 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-1 rounded-md hover:bg-red-100 text-red-600 transition-colors ml-2"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span>{subtotal.toFixed(0)} MMK</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (5%):</span>
          <span>{tax.toFixed(0)} MMK</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
          <span>Total:</span>
          <span>{total.toFixed(0)} MMK</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 active:scale-95"
      >
        <CreditCard size={20} />
        Checkout
      </button>
    </div>
  );
};
