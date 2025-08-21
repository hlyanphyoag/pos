import React, { useState } from 'react';
import { 
  Search,  
  UserCheck, 
  Mail,
  Shield,
  MonitorCheck
} from 'lucide-react';
import { User } from '../../types/admin';
import { useGetAllUsersQuery } from '../../services/authService/user.query';
import UsersSkeleton from '../UserSkeleton';

interface UsersProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onUpdateUser: (id: string, user: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
}

export const Users: React.FC<UsersProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const {data: usersData, isPending } = useGetAllUsersQuery();
  console.log("usersData:", usersData)

  
  const filteredUsers = usersData?.filter((user : User) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'CUSTOMER': return 'bg-blue-100 text-blue-800';
      case 'CASHIER': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  const admin = usersData?.filter((user: any) => user.role === 'ADMIN').length;
  const cashier = usersData?.filter((user: any) => user.role === 'CASHIER').length;
  const customer = usersData?.filter((user: any) => user.role === 'CUSTOMER').length;

 
  if(isPending) return <UsersSkeleton />
  return (
    <div className="space-y-6 dark:text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage system users and their permissions</p>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{usersData?.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <UserCheck className="text-white" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {customer}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {admin}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Administrators</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <MonitorCheck className="text-white" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {cashier}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cashier</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">User</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Role</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user : User) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Mail size={14} />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                      {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Shield className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No users found</p>
          <p className="text-gray-400 dark:text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};