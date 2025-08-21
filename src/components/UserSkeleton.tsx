import React from 'react';

const UsersSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 dark:text-white">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-md mb-2 animate-pulse"></div>
          <div className="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        </div>
      </div>

      {/* User Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="flex-1">
                <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-md mb-2 animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Filter Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Users Table Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header Skeleton */}
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="text-left py-4 px-6">
                  <div className="h-4 w-12 bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse"></div>
                </th>
                <th className="text-left py-4 px-6">
                  <div className="h-4 w-12 bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse"></div>
                </th>
                <th className="text-left py-4 px-6">
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse"></div>
                </th>
              </tr>
            </thead>
            
            {/* Table Body Skeleton */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(2)].map((_, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  {/* User Info Column */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-md mb-2 animate-pulse"></div>
                        <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Role Column */}
                  <td className="py-4 px-6">
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  </td>
                  
                  {/* Created Date Column */}
                  <td className="py-4 px-6">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersSkeleton;