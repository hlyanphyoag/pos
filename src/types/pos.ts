import { UserRole } from "./auth";

export interface ScannedProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  // barcode: string;
  image?: string;
}

export interface CartItem extends ScannedProduct {
  quantity: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'qr';
  timestamp: Date;
  status: 'pending' | 'completed' | 'cancelled';
}

export type PaymentMethod = 'cash' | 'qr';

export type DigitalPaymentMethod = 'KPay' | 'WavePay' | 'qr';

export interface PaymentDetails {
  method: 'cash' | 'digital';
  digitalMethod?: DigitalPaymentMethod;
  amount: number;
  cashReceived?: number;
  change?: number;
}

export interface CustomerDisplay {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  currentItem?: ScannedProduct;
}

export type Category = "OTHER" | "FOOD" | "DRINK" | "HOUSEHOLD" | "STATIONARY" | 'PERSONAL' | 'ELECTRONICS' | 'CLOTHING';

export interface Product{
  id: string;
  name: string;
  sku: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductPayload {
  name: string;
  sku: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  category: Category;
}

export interface ProductApiResponse {
  page: number;
  size: number;
  totalElements : number;
  total: number;
  elements : number;
  nextPage : number | null;
  results : Product[];
}


//Sales 

export interface GetSaleApiResponse{
    id: string;
    cashierId: string;
    total: number;
    paid: boolean;
    createdAt: Date;
    updatedAt: Date;
    items: [
      {
        id: string;
        saleId: string;
        productId: string;
        quantity: number;
        price: number;
        createdAt: Date;
        updatedAt: Date;
        product: Product
      }
    ],
    paymentType: {
      id: string;
      type: string;
      imageUrl: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    }
    cashier: {
      name: string;
      email: string;
    }
  }

export interface SaleApiResponse {
  page: number;
  size: number;
  totalElements : number;
  total: number;
  elements : number;
  nextPage : number | null;
  results : GetSaleApiResponse[]
}

export interface SalePayloadItems {
  productId : string;
  quantity: number
}

export interface SalePayload {
  items : SalePayloadItems[];
  paid : boolean
  paymentType: "Cash" | "KPay" | 'WavePay' | 'qr'
}

export interface SaleApiResponseItems {
  id : string;
  saleId : string;
  productId : string;
  quantity : number;
  price : number;
  createdAt : Date;
  updatedAt : Date;
  product : Product
}

export interface SaleCashier {
  name : string;
  email : string;
  profilePic : string;
  role : UserRole
}

export interface SaleApiResponse {
  id : string;
  cashierId : string;
  total : number;
  paid : boolean;
  createdAt : Date;
  updatedAt : Date;
  items : SaleApiResponseItems[];
  cashier : SaleCashier;
}

export interface  StockUpdateResponse {
  id: string;
  productId: string;
  quantity: number;
  addedById: string;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
  addedBy: {
    name: string;
    email: string
  }
}

export interface DashboardStats {
  todayRevenue: number;
  totalTransactions: number;
  totalProducts: number;
  activeUsers: number;
  lowStockCount: number;
  avgOrderValue: number;
}

export interface DashboardSales {
  date: string;
  revenue: number;
}

export interface DashboardRecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  metadata : {
    productId: string;
    quantity: number;
    addedById : string;
    cashier : string;
    saleId : string;
    amount : number;
    userId : string;
    email : string;
    role : UserRole
  }
}


export interface PaymentInfoType {
  id: string,
  type : string,
  imageUrl : string,
  isActive : boolean,
  createdAt: Date,
  updatedAt: Date
}

