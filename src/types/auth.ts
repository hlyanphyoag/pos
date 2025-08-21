export type UserRole = 'CUSTOMER' | 'ADMIN' | 'CASHIER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePic : string;
  createdAt : string;
  updatedAt : string;
  permissions: string[];
}

export interface LoginResponse {
  token: string;
  user: User
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}