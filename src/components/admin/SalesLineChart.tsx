
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardSales } from '../../types/pos';
import { formatDate } from 'date-fns';

// // Sample data - replace with your actual dashboardSalesData
// const dashboardSalesData = [
//   { date: 'Mon', revenue: 1200 },
//   { date: 'Tue', revenue: 1800 },
//   { date: 'Wed', revenue: 1400 },
//   { date: 'Thu', revenue: 2200 },
//   { date: 'Fri', revenue: 1900 },
//   { date: 'Sat', revenue: 2800 },
//   { date: 'Sun', revenue: 2400 }
// ];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dateObj = new Date(label);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'short'
    });
    
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
        <p className="text-sm text-gray-600 dark:text-gray-400">{`${formattedDate}`}</p>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {`Revenue: ${payload[0].value} MMK`}
        </p>
      </div>
    );
  }
  return null;
};

export default function SalesOverviewChart({dashboardSalesData}: {dashboardSalesData: DashboardSales[]}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Sales Overview (Last 7 Days)
      </h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dashboardSalesData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-gray-200 dark:stroke-gray-600" 
            />
            <XAxis 
              dataKey="date"
              className="text-gray-600 dark:text-gray-400"
              fontSize={12}
              tickFormatter={(date) => {
                const dateObj = new Date(date);
                // Format to show day name (Mon, Tue, etc.)
                return dateObj.toLocaleDateString('en-US', { 
                  weekday: 'short' 
                });
              }}
            />
            <YAxis 
              className="text-gray-600 dark:text-gray-400 "
              fontSize={12}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip  />} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#2563eb" 
              strokeWidth={2}
              dot={{ 
                fill: '#2563eb', 
                strokeWidth: 2, 
                r: 4 
              }}
              activeDot={{ 
                r: 6, 
                fill: '#2563eb',
                stroke: '#ffffff',
                strokeWidth: 2
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary stats below the chart */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {dashboardSalesData?.reduce((sum, data) => sum + parseInt(data.revenue as any), 0).toLocaleString()} MMK
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Average Daily</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {Math.round(dashboardSalesData?.reduce((sum, data) => sum + parseInt(data.revenue as any), 0) / dashboardSalesData?.length).toLocaleString()} MMK
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Best Day</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {Math.max(...dashboardSalesData?.map(d => d.revenue) || []).toLocaleString()} MMK
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}