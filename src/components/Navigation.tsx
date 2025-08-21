import React from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import { 
  Store, 
  LogOut, 
  User, 
  ShoppingCart, 
  BarChart3, 
  Monitor 
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { authState, logout } = useAuth();
  const router = useRouter();

  if (!authState.isAuthenticated) {
    return null;
  }

  const {user} = authState;

  const handleLogout = () => {
    logout();
    router.navigate({ to: '/login' });
  };

  const getNavItems = () => {
    switch (authState.user?.role) {
      case 'ADMIN':
        return [
          { to: '/admin', icon: BarChart3, label: 'Admin Dashboard' },
          { to: '/pos', icon: Monitor, label: 'POS System' },
        ];
      case 'CASHIER':
        return [
          { to: '/pos', icon: Monitor, label: 'POS System' },
        ];
      case 'CUSTOMER':
        return [
          { to: '/customer', icon: ShoppingCart, label: 'Shop' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Store className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900">A&E Mart</span>
            </Link>
            
            <div className="flex items-center gap-4">
              {navItems.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  activeProps={{
                    className: 'bg-blue-50 text-blue-600 hover:text-blue-700'
                  }}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {user?.profilePic ? (
                  <img src={user?.profilePic} alt="" className='rounded-full h-10 w-10'/>
              ) : (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User size={20} />
                </div>
              )}
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};