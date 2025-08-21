import { useState, useEffect, createContext, useContext } from 'react';
import { AuthState, LoginCredentials,UserRole } from '../types/auth';
import { useLoginMutation } from '../services/authService/auth.mutation';

const AuthContext = createContext<{
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  authChecked: boolean;
  isPending: boolean;
  loginError: string;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false
  });

  const [authChecked, setAuthChecked] = useState(false);

  const { mutate: loginMutation, isPending } = useLoginMutation();

  const [loginError, setLoginError] = useState('');


  useEffect(() => {
    const storedUser = localStorage.getItem('quickpos_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch {
        localStorage.removeItem('quickpos_user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    }
    setAuthChecked(true);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setAuthState(prev => ({...prev, isLoading: true }));
    loginMutation(
      { payload: credentials },
      {
        onSuccess: (data) => {
          console.log('LoginUser:', data);
          localStorage.setItem('quickpos_user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          setAuthState({
            user: data.user,
            isAuthenticated: true,
            isLoading: false
          });
          setLoginError('');
        },
        onError: (error) => {
          console.error('Login error:', error.response?.data.message);
          setLoginError(error.response?.data.message!);
        }
      }
    );
  };

  const logout = () => {
    localStorage.removeItem('quickpos_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const hasRole = (role: UserRole): boolean => {
    return authState.user?.role === role;
  };

  const hasPermission = (permission: string): boolean => {
    return authState.user?.permissions.includes(permission) || false;
  };

  return {
    authState,
    isPending,
    loginError,
    login,
    logout,
    hasRole,
    hasPermission,
    authChecked
  };
};

export { AuthContext };
