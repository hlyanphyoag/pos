import React from "react";
import { Product } from "../types";
import { Plus } from "lucide-react";
import { formatNumber } from "@/utils/formatNumberHelper";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  console.log("Images:", product.image)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" /> : (
          <div className="text-4xl font-bold text-blue-600">
          {product.name.charAt(0)}
        </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3">{product.category}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            HEllo
            {formatNumber(product.price)} MMK
          </span>
          <div className="bottom-0">
            <button
              onClick={() => onAddToCart(product)}
              className="bg-blue-600  hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200 active:scale-95"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
