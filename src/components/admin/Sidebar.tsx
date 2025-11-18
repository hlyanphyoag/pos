import React from 'react';
import { useLocation, useRouter } from '@tanstack/react-router';
import { 
  BarChart3, 
  Package, 
  TrendingUp, 
  Store,
  LogOut,
  CreditCard,
  ArrowLeftRight,
  WalletCards,
  Wallet
} from 'lucide-react';
import { AdminView } from '../../types/admin';
import { useAuth } from '../../hooks/useAuth';


export const Sidebar: React.FC = () => {

  const router = useRouter();
  const pathname = useLocation().pathname;
  const { logout, authState } = useAuth();
  // const { theme, toggleTheme } = useTheme();

  const { user } = authState;

  const handleLogout = () => {
    logout();
    router.navigate({ to: '/login' });
  };
  
  const menuItems = [
    { id: 'dashboard' as AdminView, icon: BarChart3, label: 'Dashboard', path: '/admin' },
    { id: 'inventory' as AdminView, icon: Package, label: 'Inventory', path: '/admin/inventory' },
    { id: 'sales' as AdminView, icon: TrendingUp, label: 'Sales', path: '/admin/sales' },
    { id: 'transactions' as AdminView, icon: Wallet, label: 'Transactions', path: '/admin/transaction' },
  ];

  return (
    <div className="w-20 xl:w-64 bg-gray-900 dark:bg-gray-950 text-white h-screen flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 dark:border-gray-800">
        <div className="flex items-center gap-3 xl:gap-3 justify-center xl:justify-start">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Store size={24} />
          </div>
          <div className="hidden xl:block">
            <h1 className="text-xl font-bold">QuickPOS</h1>
            <p className="text-sm text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map(({ id, icon: Icon, label, path }) => (
            <li key={id}>
              <button
                onClick={() => router.navigate({ to: path })}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 justify-center xl:justify-start ${
                  pathname === path
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-900 hover:text-white'
                }`}
                title={label}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="font-medium hidden xl:block">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 dark:border-gray-800">
        {/* Theme Toggle */}
        {/* <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-900 rounded-lg transition-colors mb-4 justify-center xl:justify-start"
          title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          <span className="text-sm hidden xl:block">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button> */}
        
        <div className="flex items-center gap-3 mb-4 justify-center xl:justify-start">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
          ) : (<div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium">JD</span>
          </div>)}
          <div className="flex-1 hidden xl:block">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-900 rounded-lg transition-colors justify-center xl:justify-start"
          title="Sign Out"
        >
          <LogOut size={16} className="flex-shrink-0" />
          <span className="text-sm hidden xl:block">Sign Out</span>
        </button>
      </div>
    </div>
  );
};