import React, { useRef, useState, useEffect } from 'react';
import { X, Download, Loader2, CheckCircle } from 'lucide-react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productSku: string;
  productId: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  productName,
  productSku,
  productId
}) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsDownloading(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const downloadQRCode = async () => {
    setIsDownloading(true);
    setIsSuccess(false);
    
    if (qrCodeRef.current) {
      try {
        const canvas = await html2canvas(qrCodeRef.current, {
          backgroundColor: '#ffffff',
          scale: 4, // Higher scale for better quality
          width: 400,
          height: 400,
        });

        // Create download link
        const link = document.createElement('a');
        link.download = `QR_${productName.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => {
            setIsDownloading(false);
            setIsSuccess(true);
        }, 1500)

        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2000);

      } catch (error) {
        console.error('Error generating QR code PNG:', error);
        setIsDownloading(false);
        setIsSuccess(false);
        alert('Failed to download QR code. Please try again.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            QR Code - {productName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* QR Code Display */}
        <div className="text-center mb-6">
          <div 
            ref={qrCodeRef}
            className="inline-block p-6 bg-white rounded-lg shadow-inner"
            style={{ backgroundColor: '#ffffff' }}
          >
            <QRCode 
              value={productSku} 
              size={200}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>
          
          {/* Product Info */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p><span className="font-medium">Product:</span> {productName}</p>
            <p><span className="font-medium">SKU:</span> {productSku}</p>
            <p><span className="font-medium">ID:</span> {productId}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
                     <button
             disabled={isDownloading || isSuccess}
             onClick={downloadQRCode}
             className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
               isSuccess || isDownloading
                 ? 'bg-blue-600 opacity-75 cursor-not-allowed text-white'
                 : 'bg-blue-600 hover:bg-blue-700 text-white'
             }`}
           >
             {isDownloading && <Loader2 size={20} className="animate-spin" />}
             {isSuccess && <CheckCircle size={20}/>}
             {!isDownloading && !isSuccess && <Download size={16} />}
             
             {isDownloading && 'Generating...'}
             {isSuccess && 'Downloaded!'}
             {!isDownloading && !isSuccess && 'Download PNG'}
           </button>
        </div>
      </div>
    </div>
  );
};
