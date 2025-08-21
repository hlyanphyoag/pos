export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  timestamp: Date;
  paymentMethod: string;
}

export type PaymentMethod = 'cash' | 'card' | 'digital';

export type DigitalPaymentMethod = 'kpay' | 'wavepay' | 'qr';

export interface PaymentDetails {
  method: 'cash' | 'digital';
  digitalMethod?: DigitalPaymentMethod;
  amount: number;
  cashReceived?: number;
  change?: number;
}

export type ApiErrorResponse = {
  message: string;
  error: string;
  statusCode: number;
};