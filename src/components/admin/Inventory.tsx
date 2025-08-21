import  { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Package
} from 'lucide-react';
import { AddProductModal } from './AddProductModal';
import { EditStockModal } from './EditStockModal';
import { QRCodeModal } from './QRCodeModal';
import QRCode from 'react-qr-code';
import { useProductCategoriesQuery, useProductQuery } from '../../services/productService/product.query';
import { Product } from '../../types/pos';
import Pagination from '../Pagination';
import { CustomDropDown } from '../CustomDropDown';
import { useDeleteProductMutation, useUpdateStockMutation } from '../../services/productService/product.mutation';
import { queryClient } from '../../lib/queryClient';


// interface InventoryProps {
//   items: Product[] | undefined;
//   isLoading: boolean;
//   isError: boolean;
// }
const CategorySkeleton = () => (
  <div className="h-10 bg-gray-200 dark:bg-gray-700  rounded-xl animate-pulse w-40 shadow-sm"></div>
);

export const Inventory = () => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [selectedCategory, setSelectedCategory] = useState('All');

  const {data: items, isPending, isError} = useProductQuery(
    currentPage, 
    itemsPerPage, 
    debounceSearchTerm, 
    selectedCategory === 'All' ? null : selectedCategory, 
    'createdAt'
  )

  const totalPages = Math.ceil(items?.totalElements!/itemsPerPage)
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditStockModal, setShowEditStockModal] = useState(false);
  const [editingStockItem, setEditingStockItem] = useState<Product | null>(null);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [selectedQRProduct, setSelectedQRProduct] = useState<Product | null>(null);

  const { mutate: updateStock, isPending: isPendingUpdateStock } = useUpdateStockMutation();

  const { data: categories, isPending: isPendingCategories } = useProductCategoriesQuery();

  const {mutate: deleteProductMutation} = useDeleteProductMutation();
  
  const filteredItems = items?.results?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    deleteProductMutation(
      id,
      {
        onSuccess: (data) => {
          console.log("Delete Product success", data)
          queryClient.invalidateQueries({queryKey: ['products']})
        },
        onError: (error) => {
          console.log("Delete Product error", error)
        }
      }
    )
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      if(searchTerm) {
        setDebounceSearchTerm(searchTerm);
      }else{
        setDebounceSearchTerm('');
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);


  const lowStockItems = items?.results?.filter(item => item.stock <= 5);

  const handleAddProduct = (productData: Product) => {
    // console.log(productData)
    // onAddItem(productData);
    setShowAddModal(false);
  };

  const handleEditStock = (item: Product) => {
    setEditingStockItem(item);
    setShowEditStockModal(true);
  };

  const handleUpdateStock = (id: string, newStock: number, reason: string) => {
    console.log("handleUpdateStock", id, newStock, reason);
    updateStock(
      {productId: id, quantity: newStock},
      {
        onSuccess: (data) => {
          console.log("Update Stock success", data)
          queryClient.invalidateQueries({queryKey: ['products']})
          setShowEditStockModal(false);
          setEditingStockItem(null);
          console.log(`Stock updated for ${id}: ${newStock} units. Reason: ${reason}`);
        },
        onError: (error) => {
          console.log("Update Stock error", error)
        }
      }
     )
  };

  const handlePriceEdit = (id: string, price: number) => {
    console.log("handlePriceEdit", id, price);
    updateStock({productId: id, price: price}, {
      onSuccess: (data) => {
        console.log("Update Price success", data)
        queryClient.invalidateQueries({queryKey: ['products']})
        setShowEditStockModal(false);
        setEditingStockItem(null);
      },
      onError: (error) => {
        console.log("Update Price error", error)
      }
    })
  }

  const handleQRCodeClick = (product: Product) => {
    setSelectedQRProduct(product);
    setShowQRCodeModal(true);
  };

  if(isError) {
    return <div>Error fetching inventory data</div>;
  }

  return (
    <div className=" dark:text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Inventory Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Manage your product inventory and stock levels</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems && lowStockItems.length > 0 && (
        <div className="bg-orange-50 mb-4  dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-orange-600 dark:text-orange-400" size={20} />
            <h3 className="font-semibold text-orange-800 dark:text-orange-400">Low Stock Alert</h3>
          </div>
          <p className="text-orange-700 dark:text-orange-300 text-sm mb-3">
            {lowStockItems?.length} item(s) are running low on stock
          </p>
          <div className="flex flex-wrap gap-2">
            {lowStockItems?.slice(0, 5).map(item => (
              <span key={item.id} className="bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm">
                {item.name} ({item.stock} left)
              </span>
            ))}
            {lowStockItems?.length ? lowStockItems?.length > 5 && (
              <span className="text-orange-600 dark:text-orange-400 text-sm">+{lowStockItems?.length - 5} more</span>
            ) : null}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 mb-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />  
          </div>

          { isPendingCategories ? <CategorySkeleton /> : (
            <CustomDropDown 
              categories = {categories}
              selectedCategory = {selectedCategory}
              setSelectedCategory = {setSelectedCategory}
              origin = 'inventory'
            />
          )}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl mb-4 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Product</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Qr Code</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Category</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Price</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Stock</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            {!isPending ? (
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {items?.results?.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                        <img src={item.image} className='w-full h-full object-cover rounded-lg'/>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleQRCodeClick(item)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      title="Click to view and download QR code"
                    >
                      <QRCode value={item.sku} size={50} />
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-900 dark:text-white">{item.price} MMK</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">{item.stock}</span>
                      {item.stock <= 10 && (
                        <AlertTriangle className="text-orange-500 dark:text-orange-400" size={16} />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.stock > 10
                        ? 'bg-green-100 text-green-800'
                        : item.stock > 0
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.stock > 10 ? 'In Stock' : 
                       item.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      
                      <button
                        onClick={() => {
                          handleEditStock(item)
                        }}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={7} className="py-4 px-6 text-center">
                    <Package className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">Loading inventory...</p>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>   
      </div>

      <div className='mb-10'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage} />
        </div>

      {filteredItems?.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No products found</p>
          <p className="text-gray-400 dark:text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Modals */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        // onAddProduct={handleAddProduct}
      />

      <EditStockModal
        isOpen={showEditStockModal}
        onClose={() => setShowEditStockModal(false)}
        onUpdateStock={handleUpdateStock}
        onPriceEdit={handlePriceEdit}
        isPending={isPendingUpdateStock}
        item={editingStockItem}
      />

      <QRCodeModal
        isOpen={showQRCodeModal}
        onClose={() => {
          setShowQRCodeModal(false);
          setSelectedQRProduct(null);
        }}
        productName={selectedQRProduct?.name || ''}
        productSku={selectedQRProduct?.sku || ''}
        productId={selectedQRProduct?.id || ''}
      />
    </div>
  );
};