import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Plus,
  Package,
  Grid,
  List,
  ChevronDown,
  Check,
} from "lucide-react";
import { ScannedProduct, CartItem } from "../../types/pos";
import {
  useProductCategoriesQuery,
  useProductQuery,
} from "../../services/productService/product.query";
import { useAuth } from "../../hooks/useAuth";
import Pagination from "../Pagination";

// Skeleton Components
const ProductSkeleton = () => (
  <div className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
    <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="flex items-center justify-between">
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

const CategorySkeleton = () => (
  <div className="h-12 bg-gray-200 rounded-xl animate-pulse w-40 shadow-sm"></div>
);

const ProductListSkeleton = () => (
  <div className="space-y-3">
    {[...Array(6)].map((_, index) => (
      <div
        key={index}
        className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 animate-pulse"
      >
        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="text-right space-y-2">
          <div className="h-5 bg-gray-200 rounded w-20"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-16"></div>
        </div>
      </div>
    ))}
  </div>
);

// Custom Dropdown Component
interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white px-3 py-2.5 pr-8 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 cursor-pointer font-medium text-gray-700 shadow-sm hover:shadow-md flex items-center justify-between"
      >
        <span className={selectedOption ? "text-gray-700" : "text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-width:thin] [scrollbar-color:rgb(209_213_219)_rgb(243_244_246)]">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 gap-1 text-left hover:bg-blue-50 transition-colors duration-150 flex items-center justify-between ${
                  value === option.value
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-700"
                }`}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <Check size={16} className="text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface ProductCatalogProps {
  onAddToCart: (product: ScannedProduct) => void;
  cartItems: CartItem[];
  userId: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onAddToCart,
  cartItems,
}) => {
  const [searchTermTrigger, setSearchTermTrigger] = useState("");
  const [searchTermDebounce, setSearchTermDebounce] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [page, setPage] = useState(1);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const itemsPerPage = 10;


  const {
    data: categories,
    isPending: isPendingCategories,
    isError: isErrorCategories,
  } = useProductCategoriesQuery();
  const {
    data: productData,
    isPending,
    isError,
  } = useProductQuery(
    page,
    itemsPerPage,
    searchTermDebounce,
    selectedCategory === "All" ? null : selectedCategory,
    sortBy
  );

  const totalPages = Math.ceil(productData?.totalElements!/itemsPerPage)

  // console.log("Categories:", categories)

  const { authState } = useAuth();
  const userId = authState?.user?.id;

  console.log("ApiProducts:", productData);

  // const categories = useMemo(() => {
  //   return [ ...Array.from(new Set(productData?.results?.map(product => product.category)))];
  // }, [productData]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = productData?.results?.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTermTrigger.toLowerCase()) ||
        product.category
          .toLowerCase()
          .includes(searchTermTrigger.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTermTrigger, selectedCategory, sortBy]);

  const getCartQuantity = (productId: string) => {
    const cartItem = cartItems.find((item) => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  //Avoid many api call by debouncing while searching data
  useEffect(() => {
    const searchHandler = setTimeout(() => {
      if (searchTermTrigger) {
        setSearchTermDebounce(searchTermTrigger);
      } else {
        setSearchTermDebounce("");
      }
    }, 500);
    return () => clearTimeout(searchHandler);
  }, [searchTermTrigger]);

  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Product Catalog
            </h2>
            <p className="text-gray-600">Browse and add products to cart</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            {viewMode === "grid" ? <List size={20} /> : <Grid size={20} />}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTermTrigger}
            onChange={(e) => setSearchTermTrigger(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-xl border border-blue-100">
              <Filter size={18} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Filters</span>
            </div>

            {isPendingCategories ? (
              <div className="flex gap-3">
                <CategorySkeleton />
                <CategorySkeleton />
                <CategorySkeleton />
              </div>
            ) : (
              <>
                <CustomDropdown
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={[
                    { value: "All", label: "All Categories" },
                    ...(categories?.map((category: string) => ({
                      value: category,
                      label: category,
                    })) || []),
                  ]}
                  placeholder="Select Category"
                  className="min-w-[180px]"
                />

                <CustomDropdown
                  value={sortBy}
                  onChange={(value) => setSortBy(value as "name" | "price")}
                  options={[
                    { value: "name", label: "Sort by Name" },
                    { value: "price", label: "Sort by Price" },
                  ]}
                  placeholder="Sort Options"
                  className="min-w-[160px]"
                />

                {/* <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 rounded-xl border border-green-100 shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-700">
                    {productData?.results?.length || 0} products found
                  </span>
                </div> */}
                <Pagination
            currentPage={page}
            totalPages={totalPages}
            setCurrentPage={setPage} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Products Display */}
      <div className="flex-1 overflow-y-auto">
        {isPending ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : (
            <ProductListSkeleton />
          )
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productData?.results?.map((product) => {
                  const cartQuantity = getCartQuantity(product.id);
                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-xl p-4 hover:bg-gray-50 transition-all duration-300 hover:shadow-xl border border-gray-200 hover:border-blue-200 transform hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                        {product?.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-4xl font-bold text-blue-600">
                            {product.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {product.category}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-blue-600">
                            {product.price} MMK
                          </span>
                          {cartQuantity > 0 && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                              {cartQuantity} in cart
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => onAddToCart(product)}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          <Plus size={16} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className='mb-10'>
          
        </div>
              </div>
            ) : (
              <div className="space-y-3">
                {productData?.results?.map((product) => {
                  const cartQuantity = getCartQuantity(product.id);
                  return (
                    <div
                      key={product.id}
                      className="group flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-blue-200 transform hover:-translate-y-0.5"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-2xl font-bold text-blue-600">
                            {product.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {product.category}
                        </p>
                        {/* <p className="text-xs text-gray-400">Barcode: {product?.barcode}</p> */}
                      </div>

                      <div className="text-right flex flex-col items-end">
                        <div className="text-xl font-bold text-blue-600 mb-1">
                          {product.price.toFixed(2)} MMK
                        </div>
                        {cartQuantity > 0 && (
                          <div className="text-xs text-green-600 font-medium mb-2 animate-pulse">
                            {cartQuantity} in cart
                          </div>
                        )}
                        <button
                          onClick={() => onAddToCart(product)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 active:scale-95 hover:shadow-lg transform hover:-translate-y-0.5 max-w-fit"
                        >
                          <Plus size={16} />
                          Add
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {productData?.results?.length === 0 && (
              <div className="text-center py-12">
                <Package size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-500">No products found</p>
                <p className="text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
