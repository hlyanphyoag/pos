import { useState } from "react";
import { FilterTypes, InventoryCategory, SaleCategory, TransactionCategory, TransactionType } from "../types/pos";
import { Filter, LucideIcon } from "lucide-react";
import { useLocation, useNavigate } from "@tanstack/react-router";


interface CustomDropDownProps {
  categories: InventoryCategory[] | SaleCategory[] | TransactionCategory[] | TransactionType[] | FilterTypes[] | undefined;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  origin: string;
  paramName?: string | undefined;
  icon?: LucideIcon | undefined;
  noIcon?: boolean;
  className?: string
}

export const CustomDropDown = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  origin,
  paramName,
  icon: Icon,
  noIcon,
  className
}: CustomDropDownProps) => {
  const navigate = useNavigate();
  // const pathname = useLocation().pathname;
  // console.log("pathname:", pathname, typeof pathname)
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        {!noIcon && (
          <div className="flex items-center gap-2">
            {Icon ? <Icon size={18} className="text-blue-500 dark:text-blue-400" /> : (<Filter size={18} className="text-blue-500 dark:text-blue-400" />)}
          </div>
        )}
        <div className="relative">
          {/* Custom Dropdown Trigger */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border-[1px] border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200  hover:shadow-sm hover:border-blue-300 dark:hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 cursor-pointer min-w-[200px] backdrop-blur-sm"
          >
            {origin !== "add_product"  ? (
              <span>
                {selectedCategory === "All"
                  ? "All Categories"
                  : selectedCategory}
              </span>
            ) : (
              <span>
                {selectedCategory ? selectedCategory : "Select a category"}
              </span>
            )}
            <svg
              className={`w-5 h-5 text-blue-500 dark:text-blue-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Custom Dropdown Content */}
          {isDropdownOpen && (
            <div className={`absolute ${(origin === "inventory" || origin === "add_product") && 'h-64' } overflow-y-auto top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-2xl backdrop-blur-lg z-50 animate-in slide-in-from-top-2 duration-200 pr-2 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:my-4 [&::-webkit-scrollbar-thumb]:bg-neutral-200 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500`}>
              <div className="py-2">
                {(origin !== "add_product" && origin !== "sales" && origin !== "transactions") && (
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                      selectedCategory === "All"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 ml-1 border-blue-500 rounded-lg"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >

                      <div>
                      <div className="font-medium">All Categories</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Show all products
                      </div>
                    </div>

                    {selectedCategory === "All" && (
                      <svg
                        className="w-4 h-4 ml-auto text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                )}

                {categories?.map((category: any) => (
                  <button
                    key={category}
                    onClick={() => {
                      navigate({
                        to: ".",
                        search: (prev) => ({
                          ...prev,
                          [paramName]: category
                        })
                      })
                      setSelectedCategory(category);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                      selectedCategory === category
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 ml-1 border-blue-500 rounded-lg"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg ml-1"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{category}</div>
                      {origin !== "add_product" && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                        Filter by {category.toLowerCase()}
                      </div>
                      )}
                    </div>
                    {selectedCategory === category && (
                      <svg
                        className="w-4 h-4 ml-auto text-blue-500 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};
