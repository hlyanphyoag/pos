import React, { useEffect, useMemo, useRef, useState } from "react";
import { ShoppingCart, Receipt } from "lucide-react";
import { useCartSocket } from "../../services/socketService";
import { useAuth } from "../../hooks/useAuth";
import { useGetOnePaymentQuery } from "../../services/PaymentService/payment.query";

interface CustomerDisplayProps {
  storeName?: string;
}

export const CustomerDisplay: React.FC<CustomerDisplayProps> = React.memo(
  ({
    // display,
    storeName = "A&E Mart",
  }) => {
    const { authState } = useAuth();
    const userId = authState?.user?.id;
    const { cartData } = useCartSocket(userId || "");
    // const { paymentData } = useCartSocket(userId || "")
    const [selectedDigitalMethod, setSelectedDigitalMethod] = useState("");

    console.log("SelectedDigitalMethodFrom:", selectedDigitalMethod);

    const {
      data: paymentInfo,
      isLoading: paymentInfoLoading,
      isError: paymentInfoError,
    } = useGetOnePaymentQuery(selectedDigitalMethod);

    console.log("CartDataFrom:", cartData);
    console.log("PaymentInfoFrom:", paymentInfo);

    // Memoize cart data to prevent unnecessary re-renders
    const memoizedCartData = useMemo(() => {
      if (!cartData) return null;
      return {
        cart: cartData.cart || [],
        subtotal: cartData.subtotal || 0,
        tax: cartData.tax || 0,
        total: cartData.total || 0,
      };
    }, [
      cartData?.cart?.length,
      cartData?.subtotal,
      cartData?.tax,
      cartData?.total,
    ]);

    const memoizedPaymentMethod = useMemo(() => {
      if (!cartData) return null;
      return {
        paymentMethod: cartData.paymentMethod,
      };
    }, [cartData?.paymentMethod]);

    useEffect(() => {
      setSelectedDigitalMethod(memoizedPaymentMethod?.paymentMethod || "");
    }, [memoizedPaymentMethod?.paymentMethod]);

    console.log("PaymentMethodFrom:", memoizedPaymentMethod?.paymentMethod);

    const orderSummaryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (orderSummaryRef.current) {
        orderSummaryRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [memoizedCartData?.cart]);

    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-8 rounded-lg shadow-lg mb-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Receipt className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {storeName}
            </h1>
            <p className="text-xl text-gray-600">Your Order Summary</p>
          </div>

          {!memoizedPaymentMethod?.paymentMethod ? (
            <div>
              {memoizedCartData?.cart && memoizedCartData.cart.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-blue-200 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                      <img
                        src={
                          memoizedCartData.cart[cartData.cart.length - 1].image
                        }
                        alt=""
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <h3 className="text-xl font-bold text-gray-900">
                          {memoizedCartData.cart[cartData.cart.length - 1].name}
                        </h3>
                        <div className="absolute top-0 left-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                      </div>
                      <p className="text-lg text-green-600 font-semibold">
                        {memoizedCartData.cart[cartData.cart.length - 1].price.toFixed(0)} MMK
                      </p>
                    </div>
                    <div className="text-right relative">
                      <p className="text-sm text-gray-500">Just Added</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="text-blue-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Your Items ({memoizedCartData?.cart.length || 0})
                    </h2>
                  </div>
                </div>

                {!memoizedCartData?.cart ||
                memoizedCartData.cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart
                      size={64}
                      className="mx-auto text-gray-300 mb-4"
                    />
                    <p className="text-xl text-gray-500">No items yet</p>
                    <p className="text-gray-400">
                      Items will appear here as they're scanned
                    </p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {memoizedCartData?.cart.map((item: any, index: number) => (
                        <tr
                          key={`${item.id}-${index}`}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
                              <img
                                src={item.image}
                                alt=""
                                className="w-12 h-12 object-cover rounded-xl"
                              />
                            </div>
                          </td>
                          <td className="p-6">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {item.name}
                              </h3>
                              <p className="text-gray-500">{item.category}</p>
                            </div>
                          </td>
                          <td className="p-6 text-center">
                            <p className="text-sm text-gray-500">Qty</p>
                            <p className="text-lg font-bold text-gray-900">
                              {item.quantity}
                            </p>
                          </td>
                          <td className="p-6 text-center">
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="text-lg font-bold text-gray-900">
                              {item.price} MMK
                            </p>
                          </td>
                          <td className="p-6 text-center">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-xl font-bold text-blue-600">
                              {item.price * item.quantity} MMK
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {memoizedCartData?.cart && memoizedCartData.cart.length > 0 && (
                <div
                  className="bg-white rounded-2xl shadow-lg p-6"
                  ref={orderSummaryRef}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Order Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold text-gray-900">
                        {memoizedCartData.subtotal} MMK
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600">Tax (5%):</span>
                      <span className="font-semibold text-gray-900">
                        {memoizedCartData.tax.toFixed(0)} MMK
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-gray-900">
                          Total:
                        </span>
                        <span className="text-3xl font-bold text-blue-600">
                          {memoizedCartData.total.toFixed(0)} MMK
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center flex-col">
              <img
                src={paymentInfo?.imageUrl}
                alt=""
                className="w-44 h-48 object-cover"
              />
              <p className="text-md text-center mt-10 text-gray-500 max-w-xs">
                Open your {paymentInfo?.type} app and scan this QR code to
                complete your payment
              </p>
            </div>
          )}
          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-500">Thank you for shopping with us!</p>
          </div>
        </div>
      </div>
    );
  }
);
