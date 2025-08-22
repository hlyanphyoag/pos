import { CartItem, PaymentDetails } from "../types/pos";

export interface ReceiptData {
  transactionId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentDetails: PaymentDetails;
  timestamp: Date;
  storeName: string;
  storeAddress: string;
  cashierName: string;
}

export const generateReceiptHTML = (receiptData: ReceiptData): string => {
  const {
    transactionId,
    items,
    subtotal,
    tax,
    total,
    paymentDetails,
    timestamp,
    storeName,
    storeAddress,
    cashierName,
  } = receiptData;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Receipt - ${transactionId}</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          max-width: 300px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          color: black;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        .store-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .store-address {
          font-size: 12px;
          margin-bottom: 10px;
        }
        .transaction-info {
          font-size: 11px;
          margin-bottom: 15px;
        }
        .items {
          margin-bottom: 15px;
        }
        .item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 12px;
        }
        .item-name {
          flex: 1;
          margin-right: 10px;
        }
        .item-qty {
          margin-right: 10px;
        }
        .item-price {
          text-align: right;
          min-width: 60px;
        }
        .totals {
          border-top: 1px solid #000;
          padding-top: 10px;
          margin-bottom: 15px;
        }
        .total-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3px;
          font-size: 12px;
        }
        .total-line.final {
          font-weight: bold;
          font-size: 14px;
          border-top: 1px solid #000;
          padding-top: 5px;
          margin-top: 5px;
        }
        .payment-info {
          border-top: 1px solid #000;
          padding-top: 10px;
          margin-bottom: 15px;
          font-size: 12px;
        }
        .footer {
          text-align: center;
          border-top: 2px solid #000;
          padding-top: 10px;
          font-size: 11px;
        }
        @media print {
          body {
            margin: 0;
            padding: 10px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="store-name">${storeName}</div>
        <div class="store-address">${storeAddress}</div>
      </div>
      
      <div class="transaction-info">
        <div>Transaction ID: ${transactionId}</div>
        <div>Date: ${timestamp.toLocaleDateString()}</div>
        <div>Time: ${timestamp.toLocaleTimeString()}</div>
        <div>Cashier: ${cashierName}</div>
      </div>
      
      <div class="items">
        ${items
          .map(
            (item) => `
          <div class="item">
            <div class="item-name">${item.name}</div>
            <div class="item-qty">${item.quantity}x</div>
            <div class="item-price">${(item.price * item.quantity).toFixed(2)} MMK</div>
          </div>
        `
          )
          .join("")}
      </div>
      
      <div class="totals">
        <div class="total-line">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)} MMK</span>
        </div>
        <div class="total-line">
          <span>Tax (5%):</span>
          <span>${tax.toFixed(2)} MMK</span>
        </div>
        <div class="total-line final">
          <span>TOTAL:</span>
          <span>${total.toFixed(2)} MMK</span>
        </div>
      </div>
      
      <div class="payment-info">
        <div>Payment Method: ${paymentDetails.method === "cash" ? "Cash" : `Digital (${paymentDetails.digitalMethod})`}</div>
        ${
          paymentDetails.method === "cash"
            ? `
          <div>Cash Received: ${paymentDetails.cashReceived?.toFixed(2)} MMK</div>
          <div>Change: ${paymentDetails.change?.toFixed(2)} MMK</div>
        `
            : ""
        }
      </div>
      
      <div class="footer">
        <div>Thank you for your business!</div>
        <div>Please come again</div>
      </div>
    </body>
    </html>
  `;
};

export const downloadReceipt = (receiptData: ReceiptData) => {
  const html = generateReceiptHTML(receiptData);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `receipt-${receiptData.transactionId}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const printReceipt = (receiptData: ReceiptData) => {
  const html = generateReceiptHTML(receiptData);
  const printWindow = window.open("", "_blank");

  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
};
