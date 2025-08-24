import React, { useState } from "react";
import { PaymentDetails, DigitalPaymentMethod } from "../../types/pos";
import {
  X,
  Banknote,
  QrCode,
  Check,
  // CreditCard,
  Smartphone,
  Download,
  Printer,
} from "lucide-react";
import {
  downloadReceipt,
  printReceipt,
  ReceiptData,
} from "../../utils/receiptGenerator";
import { useAuth } from "../../hooks/useAuth";
import { useSaleMutationQuery } from "../../services/saleServices/sale.mutation";
import { useCartSocket } from "../../services/socketService";
import KPay from "../../../public/KPay.jpg";
import WavePay from "../../../public/WavePay.jpg";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayment: (paymentDetails: PaymentDetails) => void;
  total: number;
  items: any[];
  subtotal: number;
  tax: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPayment,
  total,
  items,
  subtotal,
  tax,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<"cash" | "digital">(
    "cash"
  );
  const [selectedDigitalMethod, setSelectedDigitalMethod] =
    useState<DigitalPaymentMethod>("KPay");
  const [isComplete, setIsComplete] = useState(false);
  const [cashReceived, setCashReceived] = useState("");
  const [showDigitalPayment, setShowDigitalPayment] = useState(false);
  const [completedPaymentDetails, setCompletedPaymentDetails] =
    useState<PaymentDetails | null>(null);
  const { authState } = useAuth();

  const { emitDigitalPaymentMethod, resetAllData } = useCartSocket(
    authState?.user?.id || ""
  );

  const { mutate: saleMutation, isPending } = useSaleMutationQuery();

  if (!isOpen) return null;

  const handlePaymentMutaitonFn = () => {
    const payloadItem = items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const paymentDetails: PaymentDetails = {
      method: selectedMethod,
      digitalMethod:
        selectedMethod === "digital" ? selectedDigitalMethod : undefined,
      amount: total,
      cashReceived: selectedMethod === "cash" ? cashAmount : undefined,
      change:
        selectedMethod === "cash" ? Math.max(0, cashAmount - total) : undefined,
    };

    saleMutation(
      {
        payload: {
          items: payloadItem,
          paid: true,
          paymentType:
            selectedMethod === "cash"
              ? "Cash"
              : selectedMethod === "digital"
                ? selectedDigitalMethod
                : "Cash",
        },
      },
      {
        onSuccess: (data) => {
          console.log("Data", data);
          setCompletedPaymentDetails(paymentDetails);
          setIsComplete(true);
          resetAllData();
        },
        onError: (err) => {
          console.log(err);
          // Handle error - you might want to show an error message
        },
      }
    );
  };

  const handlePayment = async () => {
    if (selectedMethod === "cash" && parseFloat(cashReceived) < total) {
      return;
    }

    if (selectedMethod === "digital") {
      setShowDigitalPayment(true);
      // Call the API mutation for digital payment as well
      handlePaymentMutaitonFn();
    } else {
      // For cash payment
      handlePaymentMutaitonFn();
    }
  };

  const handleDownloadReceipt = () => {
    if (!completedPaymentDetails) return;

    const receiptData: ReceiptData = {
      transactionId: `TXN-${Date.now()}`,
      items,
      subtotal,
      tax,
      total,
      paymentDetails: completedPaymentDetails,
      timestamp: new Date(),
      storeName: "A&E Mart",
      storeAddress: "No.112, Main Street, Dawei, Tanintharyi",
      cashierName: authState.user?.name || "Cashier",
    };

    handleCompleteTransaction();
    downloadReceipt(receiptData);
  };

  const handlePrintReceipt = () => {
    if (!completedPaymentDetails) return;

    const receiptData: ReceiptData = {
      transactionId: `TXN-${Date.now()}`,
      items,
      subtotal,
      tax,
      total,
      paymentDetails: completedPaymentDetails,
      timestamp: new Date(),
      storeName: "A&E Mart",
      storeAddress: "No.112, Main Street, Dawei, Tanintharyi",
      cashierName: authState.user?.name || "Cashier",
    };

    handleCompleteTransaction();
    printReceipt(receiptData);
  };

  const handleCompleteTransaction = () => {
    if (completedPaymentDetails) {
      onPayment(completedPaymentDetails);
      // Reset all states
      setIsComplete(false);
      setShowDigitalPayment(false);
      setCashReceived("");
      setCompletedPaymentDetails(null);
      onClose();
    }
  };

  console.log("ShowDigitalPayment:", showDigitalPayment);

  const digitalMethods = [
    {
      id: "KPay" as DigitalPaymentMethod,
      label: "KPay",
      color: "bg-blue-500",
      imageUrl: KPay,
    },
    {
      id: "WavePay" as DigitalPaymentMethod,
      label: "WavePay",
      color: "bg-purple-500",
      imageUrl: WavePay,
    },
  ];

  const cashAmount = parseFloat(cashReceived) || 0;
  const change = cashAmount - total;

  const quickCashAmounts = [
    Math.ceil(total),
    Math.ceil(total / 10) * 10,
    Math.ceil(total / 20) * 20,
    Math.ceil(total / 50) * 50,
  ].filter(
    (amount, index, arr) => arr.indexOf(amount) === index && amount >= total
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto ">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 relative">
        <button
          onClick={() => {
            handleCompleteTransaction();
            onClose();
          }}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <X size={24} />
        </button>

        {isComplete ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Payment Successful!
            </h3>
            <p className="text-gray-600 text-lg">
              Transaction completed successfully
            </p>
            {selectedMethod === "cash" && change > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-blue-900 font-semibold text-xl">
                  Change: {change.toFixed(2)} MMK
                </p>
              </div>
            )}

            {/* Receipt Actions */}
            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={handleDownloadReceipt}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
              >
                <Download size={20} />
                Download Receipt
              </button>
              <button
                onClick={handlePrintReceipt}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
              >
                <Printer size={20} />
                Print Receipt
              </button>
            </div>

            {/* Complete Transaction Button */}
            {/* <div className="mt-6">
              <button
                onClick={handleCompleteTransaction}
                className="px-8 py-3 bg-green-400 hover:bg-green-500 text-white rounded-xl font-semibold transition-colors"
              >
                Complete Transaction
              </button>
            </div> */}
          </div>
        ) : showDigitalPayment ? (
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {selectedDigitalMethod === "qr"
                ? "Scan QR Code to Pay"
                : `Pay with ${digitalMethods.find((m) => m.id === selectedDigitalMethod)?.label}`}
            </h3>

            {selectedDigitalMethod === "qr" ? (
              <div className="w-64 h-64 bg-white border-2 border-gray-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                {/* QR Code Placeholder */}
                <div className="w-48 h-48 bg-black rounded-lg flex items-center justify-center">
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 ${Math.random() > 0.5 ? "bg-white" : "bg-black"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <div
                  className={`w-24 h-24 ${digitalMethods.find((m) => m.id === selectedDigitalMethod)?.color} rounded-2xl flex items-center justify-center`}
                >
                  <img
                    src={
                      digitalMethods.find((m) => m.id === selectedDigitalMethod)
                        ?.imageUrl
                    }
                    alt=""
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <p className="text-blue-900 font-semibold text-xl">
                Total: {total.toFixed(2)} MMK
              </p>
            </div>

            <button
              onClick={handlePayment}
              disabled={isPending}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-x-3text-white">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="font-medium text-white">
                    Processing payment...
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 text-blue-600">
                  <span className="font-medium text-white">
                    Confirm Payment
                  </span>
                </div>
              )}
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Complete Payment
            </h2>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl mb-8">
              <div className="flex justify-between items-center">
                <span className="text-xl font-medium text-gray-900">
                  Total Amount:
                </span>
                <span className="text-3xl font-bold text-blue-600">
                  {total} MMK
                </span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Select Payment Method:
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedMethod("cash")}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                    selectedMethod === "cash"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Banknote
                    size={32}
                    className={
                      selectedMethod === "cash"
                        ? "text-blue-600"
                        : "text-gray-600"
                    }
                  />
                  <span
                    className={`font-semibold text-lg ${selectedMethod === "cash" ? "text-blue-900" : "text-gray-900"}`}
                  >
                    Cash
                  </span>
                </button>

                <button
                  onClick={() => setSelectedMethod("digital")}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                    selectedMethod === "digital"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Smartphone
                    size={32}
                    className={
                      selectedMethod === "digital"
                        ? "text-blue-600"
                        : "text-gray-600"
                    }
                  />
                  <span
                    className={`font-semibold text-lg ${selectedMethod === "digital" ? "text-blue-900" : "text-gray-900"}`}
                  >
                    Digital
                  </span>
                </button>
              </div>
            </div>

            {/* Digital Payment Methods */}
            {selectedMethod === "digital" && (
              <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-700 mb-4">
                  Choose Digital Payment:
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {digitalMethods.map(({ id, label, color, imageUrl }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedDigitalMethod(id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                        selectedDigitalMethod === id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}
                      >
                        {id === "qr" ? (
                          <QrCode className="text-white" size={20} />
                        ) : (
                          <img
                            src={imageUrl}
                            alt=""
                            className="w-full h-full"
                          />
                        )}
                      </div>
                      <span
                        className={`font-medium text-sm ${selectedDigitalMethod === id ? "text-blue-900" : "text-gray-900"}`}
                      >
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cash Payment Details */}
            {selectedMethod === "cash" && (
              <div className="mb-8">
                <label className="block text-lg font-medium text-gray-700 mb-4">
                  Cash Received
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl text-center font-semibold"
                />

                {/* Quick Cash Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {quickCashAmounts.slice(0, 4).map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setCashReceived(amount.toString())}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
                    >
                      {amount} MMK
                    </button>
                  ))}
                </div>

                {cashAmount > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Change:</span>
                      <span
                        className={`font-bold text-xl ${change >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {Math.max(0, change).toFixed(2)} MMK
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={
                selectedMethod === "cash"
                  ? handlePayment
                  : () => {
                      emitDigitalPaymentMethod(selectedDigitalMethod);
                      setShowDigitalPayment(true);
                    }
              }
              disabled={
                isPending || (selectedMethod === "cash" && cashAmount < total)
              }
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl font-semibold text-xl transition-colors duration-200 flex items-center justify-center gap-3"
            >
              {isPending ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : selectedMethod === "cash" ? (
                <>
                  <Banknote size={24} />
                  Process Cash Payment
                </>
              ) : (
                <>
                  <Smartphone size={24} />
                  Pay with{" "}
                  {
                    digitalMethods.find((m) => m.id === selectedDigitalMethod)
                      ?.label
                  }
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
