import { formatNumber } from '@/utils/formatNumberHelper';
import { ArrowUp, ArrowDown, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change: string | undefined;
  positive: boolean;
  color: string;
  moneyOrNot: boolean | undefined
}

export const StatCard = ({ title, value, icon: Icon, change, positive, color, moneyOrNot }: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="text-white" size={24} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {positive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          {change}
        </div>
      </div>
      <div>
        <div className='flex items-baseline gap-2'>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{formatNumber(parseInt(value))}</h3>
          {moneyOrNot && <span className="text-gray-500 text-md font-medium">MMK</span>}
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
      </div>
    </div>
  );
};
