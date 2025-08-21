

// Base Skeleton Component
const Skeleton = ({ className = "", ...props }) => (
  <div
    className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    {...props}
  />
);

// Main Dashboard Skeleton Component
export const DashboardSkeleton = () => {
  // Skeleton data for 6 stat cards (matching your statCards array)
  const skeletonStatCards = Array.from({ length: 6 }, (_, index) => ({ id: index }));
  
  // Skeleton data for recent activities
  const skeletonActivities = Array.from({ length: 4 }, (_, index) => ({ id: index }));

  return (
    <div className="space-y-6 dark:text-white">
      {/* Header Section - matches your header */}
      <div>
        <Skeleton className="w-40 h-9 mb-2" /> {/* Dashboard title */}
        <Skeleton className="w-80 h-5" /> {/* Welcome message */}
      </div>

      {/* Stats Grid - exactly matching your grid structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletonStatCards.map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              {/* Icon skeleton */}
              <div className="w-12 h-12 rounded-lg">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
              {/* Change percentage skeleton */}
              <div className="flex items-center gap-1">
                <Skeleton className="w-4 h-4" /> {/* Arrow icon */}
                <Skeleton className="w-12 h-4" /> {/* Percentage */}
              </div>
            </div>
            <div>
              {/* Value skeleton */}
              <Skeleton className="w-24 h-8 mb-1" />
              {/* Title skeleton */}
              <Skeleton className="w-20 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section - exactly matching your grid structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart Skeleton - matches SalesOverviewChart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          {/* Chart title */}
          <Skeleton className="w-56 h-6 mb-6" />
          
          {/* Chart area */}
          <div className="h-64 mb-6">
            {/* Chart grid background */}
            <div className="h-full flex items-end justify-center">
              <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="w-full h-32" />
              </div>
            </div>
          </div>
          
          {/* Summary stats section - matches your chart summary */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="w-20 h-3 mx-auto mb-2" />
                  <Skeleton className="w-16 h-6 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Skeleton - exactly matching your activity section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          {/* Activity title */}
          <Skeleton className="w-32 h-6 mb-4" />
          
          {/* Activities list */}
          <div className="space-y-4">
            {skeletonActivities.map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg"
              >
                {/* Activity icon */}
                <div className="w-8 h-8 rounded-full">
                  <Skeleton className="w-full h-full rounded-full" />
                </div>

                {/* Activity content */}
                <div className="flex-1">
                  <Skeleton className="w-28 h-4 mb-1" /> {/* Activity title */}
                  <Skeleton className="w-40 h-3" /> {/* Activity description */}
                </div>

                {/* Timestamp */}
                <Skeleton className="w-16 h-3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;