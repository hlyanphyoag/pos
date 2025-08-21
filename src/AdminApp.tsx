import { useState } from 'react';
import { Sidebar } from './components/admin/Sidebar';
import { Dashboard } from './components/admin/Dashboard';
import { Inventory } from './components/admin/Inventory';
import { Sales } from './components/admin/Sales';
import { Users } from './components/admin/Users';
import { Settings } from './components/admin/Settings';
import { AdminView, User, InventoryItem } from './types/admin';
import { 
  mockUsers, 
  mockSalesData, 
  // mockInventoryItems, 
  mockDashboardStats 
} from './data/adminData';


function AdminApp() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [users, setUsers] = useState<User[]>(mockUsers);


  const handleAddUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...userData } : user
    ));
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  // const handleAddInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
  //   const newItem: InventoryItem = {
  //     ...itemData,
  //     id: Date.now().toString()
  //   };
  //   setInventoryItems(prev => [...prev, newItem]);
  // };


  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={mockDashboardStats} 
            salesData={mockSalesData} 
          />
        );
      case 'inventory':
        return (
          <Inventory />
        );
      case 'sales':
        return <Sales salesData={mockSalesData} />;
      case 'users':
        return (
          <Users
            users={users}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard stats={mockDashboardStats} salesData={mockSalesData} />;
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 overflow-auto">
          <div className="p-8 dark:bg-gray-900 min-h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
}

export default AdminApp;