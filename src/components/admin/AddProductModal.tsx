import React, { useState, useRef } from 'react';
import { X, Package, Save, AlertCircle, Upload } from 'lucide-react';
import { Category, Product } from '../../types/pos';
import { useProductCategoriesQuery } from '../../services/productService/product.query';
import { CustomDropDown } from '../CustomDropDown';
import { useUploadImageMutation } from '../../services/imageService/image.mutation';
import { useAddProductMutation } from '../../services/productService/product.mutation';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { toast } from 'sonner';



export const UploadImageSkeleton = () => (
  <div className='flex items-center justify-center'>
    <div className="h-48 bg-gray-200 dark:bg-gray-700  rounded-xl animate-pulse w-48 shadow-sm"></div>
  </div>
);

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    image: '',
    import_price: '',
    price: '',
    stock: '',
    category: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { mutate: createProductMutation } = useAddProductMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const [selectedCategory] = useState('All');
  console.log("Selected Category:", selectedCategory)

  const { data: categories } = useProductCategoriesQuery();
  const { mutate: uploadImageMutation, isPending: isUploadingImage } = useUploadImageMutation()

  console.log("FormData:", formData)


  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }
    if (!formData.import_price || parseFloat(formData.import_price) <= 0) {
      newErrors.import_price = 'Valid import price is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  console.log("FormImage:", formData.image)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      description: formData.description.trim(),
      image: formData.image,
      price: parseFloat(formData.price),
      import_price: parseFloat(formData.import_price),
      stock: parseInt(formData.stock),
      category: formData.category as Category
    };

    createProductMutation(
      newProduct,
      {
        onSuccess: (data) => {
          console.log("Product Added:", data)
          setFormData({
            name: '',
            sku: '',
            description: '',
            image: '',
            price: '',
            import_price: '',
            stock: '',
            category: 'All'
          });
          setErrors({});
          setImagePreview(null);
          setIsSubmitting(false);
          toast.info("Product created succefully!", {
            position:"top-right",
          })
          queryClient.invalidateQueries({
            queryKey: ['products']
          })
          onClose();
        },
        onError: (error) => {
          console.log("Error:", error)
          setErrors({ error: error.response?.data?.message || 'An error occurred' });
          setIsSubmitting(false);
        }
      }
    )
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }

      uploadImageMutation(
        file,
        {
          onSuccess: (data) => {
            console.log("Image Uploaded:", data.url)
            setImagePreview(data.url)
            setFormData(prev => ({ ...prev, image: data.url }));
          },
          onError: (error) => {
            console.log("Error:", error)
          }
        }
      )
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerateSKU = () => {
    // Generate a SKU in format "SKU" + 4-digit number (e.g., "SKU1009")
    const randomNumber = Math.floor(Math.random() * 10000); // 0-9999
    const paddedNumber = randomNumber.toString().padStart(4, '0'); // Ensure 4 digits with leading zeros
    const generatedSKU = `SKU${paddedNumber}`;

    setFormData(prev => ({ ...prev, sku: generatedSKU }));
  };


  if (!isOpen) return null;

  // const qrCodeDataUrl = formData.sku ? generateQRCode(formData.sku) : '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto 
      [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:my-4 [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500
      ">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Product</h2>
              <p className="text-gray-600 dark:text-gray-400">Create a new product in your inventory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {/* Form Fields */}
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400">
                    <AlertCircle size={16} />
                    <span className="text-sm">{errors.name}</span>
                  </div>
                )}
              </div>

              {/* SKU */}
              <div className='flex gap-2'>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <CustomDropDown
                    categories={categories}
                    selectedCategory={formData.category}
                    setSelectedCategory={(category) => handleInputChange('category', category)}
                    origin='add_product'
                    noIcon={true}
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SKU *
                  </label>
                  <div className='flex items-center gap-2'>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      className={`w-[312px] px-4 py-[5px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.sku ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                        }`}
                      placeholder="Enter SKU (e.g., P0001)"
                    />
                    <Button
                      type="button"
                      onClick={handleGenerateSKU}
                      variant={"custom"}
                    >
                      Generate
                    </Button>
                  </div>
                  {errors.sku && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400">
                      <AlertCircle size={16} />
                      <span className="text-sm">{errors.sku}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className='flex gap-2 justify-between'>
                {/* import Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Import Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.import_price}
                    onChange={(e) => handleInputChange('import_price', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.import_price ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                      }`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400">
                      <AlertCircle size={16} />
                      <span className="text-sm">{errors.import_price}</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.price ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                      }`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400">
                      <AlertCircle size={16} />
                      <span className="text-sm">{errors.price}</span>
                    </div>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.stock ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                      }`}
                    placeholder="0"
                  />
                  {errors.stock && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400">
                      <AlertCircle size={16} />
                      <span className="text-sm">{errors.stock}</span>
                    </div>
                  )}
                </div>

              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Enter product description"
                />
              </div>

              {/* Product Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Image (Optional)
                </label>
                <div className="space-y-4">
                  {isUploadingImage ? (
                    <UploadImageSkeleton />
                  ) : imagePreview ? (
                    <div className="relative flex items-center justify-center">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-46 h-48"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                    >
                      <Upload className="text-gray-400 dark:text-gray-500 mb-2" size={32} />
                      <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                        Click to upload image<br />
                        <span className="text-xs">Max 5MB</span>
                      </p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {errors.image && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle size={16} />
                      <span className="text-sm">{errors.image}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant={"custom"}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Add Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};