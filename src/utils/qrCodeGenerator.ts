// utils/downloadQRCodes.ts
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface Product {
  id: string;
  name: string;
  sku: string;
  image?: string;
}

export const downloadQRCodesAsPDF = async (products: Product[]) => {
  if (products.length === 0) {
    toast.error('No products to generate QR codes for');
    return;
  }

  const loadingToast = toast.loading('Generating QR codes PDF...');

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Settings for layout
    const qrSize = 50; // mm
    const padding = 10; // mm
    const labelHeight = 15; // mm
    const itemHeight = qrSize + labelHeight + padding;
    const itemWidth = qrSize + padding;
    const itemsPerRow = 3;
    const startX = 15; // mm from left
    const startY = 15; // mm from top
    const pageHeight = 297; // A4 height in mm
    const maxItemsPerPage = Math.floor((pageHeight - startY - 10) / itemHeight) * itemsPerRow;

    let currentPage = 0;
    let itemsOnCurrentPage = 0;

    // Generate each QR code
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      // Check if we need a new page
      if (itemsOnCurrentPage >= maxItemsPerPage) {
        pdf.addPage();
        currentPage++;
        itemsOnCurrentPage = 0;
      }

      const col = itemsOnCurrentPage % itemsPerRow;
      const row = Math.floor(itemsOnCurrentPage / itemsPerRow);
      const x = startX + col * (itemWidth + padding);
      const y = startY + row * itemHeight;

      // Get QR code from the existing table
      const qrCodeDataURL = await getQRCodeAsDataURL(product.sku);
      
      if (qrCodeDataURL) {
        // Add QR code to PDF
        pdf.addImage(qrCodeDataURL, 'PNG', x, y, qrSize, qrSize);
        
        // Add border
        pdf.setDrawColor(229, 231, 235);
        pdf.setLineWidth(0.5);
        pdf.rect(x - 2, y - 2, qrSize + 4, qrSize + labelHeight + 2);
        
        // Add product name
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        const productName = product.name.length > 25 ? product.name.substring(0, 25) + '...' : product.name;
        const textX = x + qrSize / 2;
        const textY = y + qrSize + 6;
        pdf.text(productName, textX, textY, { align: 'center', maxWidth: qrSize - 2 });
        
        // Add SKU
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(107, 114, 128);
        pdf.text(`SKU: ${product.sku}`, textX, textY + 5, { align: 'center', maxWidth: qrSize - 2 });
      }

      itemsOnCurrentPage++;
    }

    // Save PDF
    pdf.save(`qr-codes-${new Date().getTime()}.pdf`);

    toast.dismiss(loadingToast);
    toast.success(`Downloaded ${products.length} QR codes as PDF`);

  } catch (error) {
    console.error('Error generating QR codes PDF:', error);
    toast.dismiss(loadingToast);
    toast.error('Failed to generate QR codes PDF');
  }
};

// Helper function to convert QR code to data URL
const getQRCodeAsDataURL = (sku: string): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      resolve('');
      return;
    }

    canvas.width = 200;
    canvas.height = 200;

    // Create temporary div to render QR code
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.innerHTML = `<div id="qr-temp-${Date.now()}"></div>`;
    document.body.appendChild(tempDiv);

    // Dynamically import and render QR code
    Promise.all([
      import('react-qr-code'),
      import('react-dom/client'),
      import('react')
    ]).then(([QRCodeModule, ReactDOM, React]) => {
      const QRCodeComponent = QRCodeModule.default;
      const container = tempDiv.querySelector('div');
      if (container) {
        const root = ReactDOM.createRoot(container);
        const element = React.createElement(QRCodeComponent, { value: sku, size: 200 });
        root.render(element);

        setTimeout(() => {
            const svgElement = container.querySelector('svg');
            if (svgElement) {
              const svgData = new XMLSerializer().serializeToString(svgElement);
              const img = new Image();
              const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
              const url = URL.createObjectURL(svgBlob);

              img.onload = () => {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, 200, 200);
                ctx.drawImage(img, 0, 0, 200, 200);
                
                const dataURL = canvas.toDataURL('image/png');
                URL.revokeObjectURL(url);
                document.body.removeChild(tempDiv);
                resolve(dataURL);
              };

              img.onerror = () => {
                document.body.removeChild(tempDiv);
                resolve('');
              };

              img.src = url;
            } else {
              document.body.removeChild(tempDiv);
              resolve('');
            }
          }, 100);
        } else {
          document.body.removeChild(tempDiv);
          resolve('');
        }
      });
    })
  }
