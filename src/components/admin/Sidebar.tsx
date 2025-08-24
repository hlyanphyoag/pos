import React from 'react';
import { useRouter } from '@tanstack/react-router';
import { 
  BarChart3, 
  Package, 
  TrendingUp, 
  Users, 
  Settings, 
  Store,
  LogOut,
  Sun,
  Moon,
  CreditCard
} from 'lucide-react';
import { AdminView } from '../../types/admin';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

interface SidebarProps {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {

  const router = useRouter();
  const { logout, authState } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const {user} = authState;

  const handleLogout = () => {
    logout();
    router.navigate({ to: '/login' });
  };
  
  const menuItems = [
    { id: 'dashboard' as AdminView, icon: BarChart3, label: 'Dashboard' },
    { id: 'inventory' as AdminView, icon: Package, label: 'Inventory' },
    { id: 'sales' as AdminView, icon: TrendingUp, label: 'Sales' },
    { id: 'users' as AdminView, icon: Users, label: 'Users' },
    { id: 'settings' as AdminView, icon: CreditCard, label: 'payment' },
  ];

  return (
    <div className="w-64 bg-gray-900 dark:bg-gray-950 text-white h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Store size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">A&E Mart</h1>
            <p className="text-sm text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map(({ id, icon: Icon, label }) => (
            <li key={id}>
              <button
                onClick={() => onViewChange(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeView === id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-900 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 dark:border-gray-800">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-900 rounded-lg transition-colors mb-4"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          <span className="text-sm">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        
        <div className="flex items-center gap-3 mb-4">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          ) : (<div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">JD</span>
          </div>)}
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-900 rounded-lg transition-colors">
          <LogOut size={16} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};