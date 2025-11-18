export const TableSkeleton = () => {
  return (
    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
      {[...Array(3)].map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {/* Sale ID Column */}
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </td>

          {/* Date & Time Column */}
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </td>

          {/* Cashier Column */}
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-8 w-8">
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="ml-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          </td>

          {/* Items Column */}
          <td className="px-6 py-4">
                  <div
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-md px-2 py-1"
                  >
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-full w-8 ml-2"></div>
            </div>
          </td>

          {/* Total Column */}
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
          </td>

          {/* Status Column */}
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-12"></div>
          </td>

          {/* Actions Column */}
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default TableSkeleton;
