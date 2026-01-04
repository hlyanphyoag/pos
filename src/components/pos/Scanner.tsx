import React, { useState, useEffect } from "react";
import { Scan, Camera, Package, Plus, Minus, X } from "lucide-react";
import { ScannedProduct, CartItem } from "../../types/pos";
import { Scanner as QrScanner } from "@yudiel/react-qr-scanner";
// import BarcodeScanner from "react-qr-barcode-scanner";
import { useProductQueryBySku } from "../../services/productService/product.query";

interface ScannerProps {
  onProductScanned: (product: ScannedProduct) => void;
  onManualAdd: (product: ScannedProduct) => void;
  recentItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export const Scanner: React.FC<ScannerProps> = ({
  onProductScanned,
  recentItems,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  // const [scanAnimation, setScanAnimation] = useState(false);
  // const inputRef = useRef<HTMLInputElement>(null);
  const [skuByScanner, setSkuByScanner] = useState("");

  const { data: productBySku } = useProductQueryBySku(skuByScanner!);

  console.log("productBySku", productBySku);

  const handleScan = () => {
    setIsScanning(true);
  };

  useEffect(() => {
    if (productBySku) {
      (onProductScanned(productBySku),
        setTimeout(() => setIsScanning(false), 500));
    }
  }, [productBySku]);

  const handleScanQr = (result: any) => {
    console.log("Here from handleScanQr");
    if (result) {
      console.log("QR Code Scanned:", result[0].rawValue);
      setSkuByScanner(result[0].rawValue);
    } else {
      console.log("Error")
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
          <Scan className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Scanner</h2>
          <p className="text-gray-600">Scan or enter product QR Code</p>
        </div>
      </div>

      {/* Scanner Interface */}
      <div className="mb-8">
        <div
          className={`relative bg-gray-900 rounded-2xl p-8 mb-6 overflow-hidden ${isScanning ? "ring-4 ring-blue-500 ring-opacity-50" : ""
            }`}
        >
          <div className="flex flex-col items-center justify-center text-center">
            {!isScanning ? (
              <div
                className={`w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${isScanning ? "scale-110 animate-pulse" : ""
                  }`}
              >
                <Camera className="text-white" size={32} />
              </div>
            ) : (
              <div className="max-h-64 mb-6">
                <QrScanner
                  onScan={handleScanQr}
                  onError={(error) => {
                    console.log("Error:", error);
                  }}
                  formats={['qr_code', 'ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e']}
                  constraints={{
                    facingMode: "environment",
                  }}
                  classNames={{
                    container: "w-full max-w-[500px] h-[500px] mx-auto",
                  }}
                  styles={{
                    container: {
                      width: "100%",
                      maxWidth: "500px",
                      height: "250px",
                      margin: "0 auto",
                      borderRadius: "30px",
                    },
                  }}
                />
                {/* <BarcodeScanner
                  width={500}
                  height={500}
                  onUpdate={(err, result) => { handleScanQr(result, err) }}
                /> */}
              </div>
            )}
            <h3 className="text-white text-xl font-semibold mb-2">
              {isScanning ? "Scanning..." : "Ready to Scan"}
            </h3>
            <p className="text-gray-400 mb-6">
              {isScanning
                ? "Please wait while we process the QR Code"
                : "Position QR Code in front of scanner"}
            </p>

            {/* Scanning Animation */}
            {/* {scanAnimation && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-1 bg-red-500 animate-pulse"></div>
              </div>
            )} */}
          </div>
        </div>

        <div className="flex gap-4">
          {/* <button
            onClick={handleScan}
            disabled={isScanning}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-3"
          >
            <Scan size={24} />
            {isScanning ? "Scanning..." : "Start Scan"}
          </button> */}
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-3"
          >
            <Scan size={24} />
            {isScanning ? "Scanning..." : "Start Scan"}
          </button>
        </div>
      </div>

      {/* Recent Items */}
      {recentItems?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Items
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentItems?.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                  <Package className="text-blue-600" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    ${item?.price?.toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))
                    }
                    className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
