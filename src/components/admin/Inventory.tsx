import { Plus, Search, Edit, Trash2, AlertTriangle, Package, Download } from 'lucide-react';
import { AddProductModal } from './AddProductModal';
import { EditStockModal } from './EditStockModal';
import { QRCodeModal } from './QRCodeModal';
import QRCode from 'react-qr-code';
import Pagination from '../Pagination';
import { CustomDropDown } from '../CustomDropDown';
import { useInventory } from '../../hooks/useInventory';
import { Button } from '../ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { formatNumber } from '@/utils/formatNumberHelper';
import { useState } from 'react';
import { downloadQRCodesAsPDF } from '@/utils/qrCodeGenerator';

const CategorySkeleton = () => (
  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse w-40 shadow-sm"></div>
);

export const Inventory = () => {
  const {
    items,
    categories,
    lowStockItems,
    totalPages,
    isPending,
    isError,
    isPendingCategories,
    isPendingUpdateStock,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    showAddModal,
    setShowAddModal,
    showEditStockModal,
    setShowEditStockModal,
    showQRCodeModal,
    setShowQRCodeModal,
    editingStockItem,
    selectedQRProduct,
    setSelectedQRProduct,
    handleDelete,
    handleEditStock,
    handleUpdateStock,
    handlePriceEdit,
    handleQRCodeClick,
  } = useInventory();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Toggle individual item selection
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Toggle select all items on current page
  const toggleSelectAll = () => {
    if (selectedItems.length === items?.results?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items?.results?.map(item => item.id) || []);
    }
  };

  // Download selected QR codes as PDF
  const handleDownloadQRCodes = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item');
      return;
    }

    const selectedProducts = items?.results?.filter(item => 
      selectedItems.includes(item.id)
    );

    if (selectedProducts && selectedProducts.length > 0) {
      downloadQRCodesAsPDF(selectedProducts);
    }
  };

  if (isError) {
    return <div>Error fetching inventory data</div>;
  }

  return (
    <div className="dark:text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Inventory Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Manage your product inventory and stock levels</p>
        </div>
        <div className="flex gap-2">
          {selectedItems.length > 0 && (
            <Button
              onClick={handleDownloadQRCodes}
              variant="outline"
            >
              <Download size={20} />
              Download QR Codes ({selectedItems.length})
            </Button>
          )}
          <Button
            onClick={() => setShowAddModal(true)}
            variant="custom"
          >
            <Plus size={20} />
            Add Product
          </Button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems && lowStockItems.length > 0 && (
        <div className="bg-orange-50 mb-4 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
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

          {isPendingCategories ? <CategorySkeleton /> : (
            <CustomDropDown
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              origin='inventory'
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
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                  <Checkbox
                    checked={selectedItems.length === items?.results?.length && items?.results?.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Product</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">QR Code</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Category</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Import Price</th>
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
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleItemSelection(item.id)}
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                          <img src={item.image} className='w-full h-full object-cover rounded-lg' />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.id}</p>
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
                      <div className="font-semibold text-gray-900 dark:text-white">{formatNumber(item.import_price)}
                        <span className="text-gray-500 text-xs">MMK</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900 dark:text-white">{formatNumber(item.price)}
                        <span className="text-gray-500 text-xs">MMK</span>
                      </div>
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
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.stock > 10
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
                          onClick={() => handleEditStock(item)}
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
                  <td colSpan={9} className="py-4 px-6 text-center">
                    <Package className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">Loading inventory...</p>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>

      <div className='mb-10 mt-6'>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage} />
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
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