import React, { useRef, useState } from "react";
import {
  Save,
  Upload,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  X,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import { useUploadImageMutation } from "../../services/imageService/image.mutation";
import { useDeletePaymentInfoMutation, usePaymentInfoMutation } from "../../services/PaymentService/payment.mutation";
import { useGetAllPaymentQuery } from "../../services/PaymentService/payment.query";
import { queryClient } from "../../lib/queryClient";

interface PaymentInfo {
  id: string;
  type: string;
  imageUrl: string;
}

export const Settings: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [typeOfPayment, setTypeOfPayment] = useState("");
  const [error, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingType, setEditingType] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { mutate: uploadImageMutation } = useUploadImageMutation();
  const [paymentMutationError, setPaymentMutationError] = useState<string | null>(null);
  
  const {
    mutate: uploadPaymentInfo,
    isPending,
    isError,
  } = usePaymentInfoMutation();

  const {
    data: paymentInfoData,
    isPending: getPaymentInfoPending,
    isError: getPaymentInfoError,
  } = useGetAllPaymentQuery();

  const { mutate: deletePayementInfo } = useDeletePaymentInfoMutation()

  const handleDelete = (type: string) => {
    deletePayementInfo(
      type,
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['payment'] })
        },
        onError: () => {
          console.log("Delete Payment error")
        }
      }
    )
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Image size must be less than 5MB" }));
        return;
      }
      uploadImageMutation(file, {
        onSuccess: (data) => {
          setImagePreview(data.url);
          setErrors((prev) => ({ ...prev, image: "" }));
        },
        onError: () => setErrors((prev) => ({ ...prev, image: "Failed to upload image" })),
      });
    }
  };

  const handleAddPayment = () => {
    if (!typeOfPayment.trim() || !imagePreview) {
      setErrors({ type: !typeOfPayment.trim() ? "Payment name is required" : "", image: !imagePreview ? "QR code image is required" : "" });
      return;
    }

    uploadPaymentInfo(
      { type: typeOfPayment, imageUrl: imagePreview },
      {
        onSuccess: () => {
          setTypeOfPayment("");
          setImagePreview(null);
          setErrors({});
          setPaymentMutationError(null);
        },
        onError: (error) => setPaymentMutationError(error.message),
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Payment Methods
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your QR payment options</p>
            </div>
          </div>
        </div>

        {/* Add New Payment */}
        <div className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-xl shadow-gray-200/20 dark:shadow-gray-900/20 p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Image Upload Area */}
            <div className="flex-shrink-0">
              {imagePreview ? (
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-1">
                    <img 
                      src={imagePreview} 
                      alt="Payment QR" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600 flex flex-col items-center justify-center hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mb-1 group-hover:bg-blue-500/20 transition-colors">
                    <ImageIcon size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Upload</span>
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              {error.image && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={10} />
                  {error.image}
                </p>
              )}
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Payment method name (e.g., KPay, WavePay)"
                  value={typeOfPayment}
                  onChange={(e) => {
                    setTypeOfPayment(e.target.value);
                    setErrors((prev) => ({ ...prev, type: "" }));
                  }}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 focus:bg-white dark:focus:bg-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                />
                {error.type && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {error.type}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddPayment}
                  disabled={isPending}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white rounded-2xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center gap-2 hover:scale-105 disabled:hover:scale-100"
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Add Method
                    </>
                  )}
                </button>
                
                {paymentMutationError && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle size={16} />
                    <span>{paymentMutationError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-xl shadow-gray-200/20 dark:shadow-gray-900/20 overflow-hidden">
          {getPaymentInfoPending ? (
            <div className="p-16 text-center">
              <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading payment methods...</p>
            </div>
          ) : paymentInfoData && paymentInfoData.length > 0 ? (
            <div className="divide-y divide-gray-100/60 dark:divide-gray-700/60">
              {paymentInfoData.map((payment: PaymentInfo) => (
                <div 
                  key={payment.id} 
                  className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    {/* Payment QR Image */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 p-1 flex-shrink-0">
                      <img 
                        src={payment.imageUrl} 
                        alt={payment.type} 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>

                    {/* Payment Details */}
                    <div className="flex-1 min-w-0">
                      {editingId === payment.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingType}
                            onChange={(e) => setEditingType(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              console.log("Save edit:", { id: editingId, type: editingType });
                              setEditingId(null);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                              {payment.type}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                              QR Payment Method
                            </p>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingId(payment.id);
                                setEditingType(payment.type);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 hover:scale-110"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(payment.type)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 hover:scale-110"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No payment methods yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Add your first payment method to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};