import React from 'react';
import { 
  Battery, 
  Calendar, 
  Target, 
  Zap
} from 'lucide-react';
import { Reading } from '../types';
import { MONTHLY_LIMIT } from './constants';

interface ConsumptionStatsProps {
  readings: Reading[];
  status: 'alert' | 'warning' | 'success';
}

export const ConsumptionStats = ({ readings, status }: ConsumptionStatsProps) => {
  const getTotalConsumption = () => {
    return readings.slice(1).reduce((sum, reading, index) => {
      const consumption = reading.value - readings[index].value;
      return sum + consumption;
    }, 0);
  };

  const getAverageDailyConsumption = () => {
    const total = getTotalConsumption();
    const days = readings.length - 1;
    return days > 0 ? (total / days).toFixed(2) : '0';
  };

  const getDaysRemaining = () => {
    if (readings.length === 0) return 0;
    const startDate = new Date(readings[0].date.split('/').reverse().join('-'));
    const lastDate = new Date(startDate);
    lastDate.setDate(startDate.getDate() + 30);
    const currentDate = new Date();
    const remaining = Math.ceil(
      (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, remaining);
  };

  const getRemainingDaily = () => {
    const daysLeft = getDaysRemaining();
    if (daysLeft <= 0) return '0.00';
    const remaining = MONTHLY_LIMIT - getTotalConsumption();
    return (remaining / daysLeft).toFixed(2);
  };

  const getProgressPercentage = () => {
    const total = getTotalConsumption();
    return (total / MONTHLY_LIMIT) * 100;
  };

  const getProgressBarWidth = () => {
    const percentage = getProgressPercentage();
    return `${Math.min(percentage, 100)}%`;
  };

  return (
    <div className={`p-6 rounded-lg ${
      status === 'alert' ? 'bg-red-100' :
      status === 'warning' ? 'bg-yellow-100' :
      'bg-green-100'
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Total Consumption */}
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-full">
              <Zap className={`h-6 w-6 ${
                status === 'alert' ? 'text-red-600' :
                status === 'warning' ? 'text-yellow-600' :
                'text-green-600'
              }`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Consumption</p>
              <p className="text-2xl font-semibold">
                {getTotalConsumption().toFixed(2)} kWh
              </p>
            </div>
          </div>

          {/* Average Daily */}
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-full">
              <Battery className={`h-6 w-6 ${
                status === 'alert' ? 'text-red-600' :
                status === 'warning' ? 'text-yellow-600' :
                'text-green-600'
              }`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Daily</p>
              <p className="text-2xl font-semibold">
                {getAverageDailyConsumption()} kWh
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Remaining Target */}
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-full">
              <Target className={`h-6 w-6 ${
                status === 'alert' ? 'text-red-600' :
                status === 'warning' ? 'text-yellow-600' :
                'text-green-600'
              }`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Remaining Daily Target</p>
              <p className="text-2xl font-semibold">{getRemainingDaily()} kWh</p>
            </div>
          </div>

          {/* Days Remaining */}
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-full">
              <Calendar className={`h-6 w-6 ${
                status === 'alert' ? 'text-red-600' :
                status === 'warning' ? 'text-yellow-600' :
                'text-green-600'
              }`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Days Remaining</p>
              <p className="text-2xl font-semibold">{getDaysRemaining()}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="md:col-span-2">
          <div className="w-full bg-white rounded-full h-4 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                status === 'alert' ? 'bg-red-500' :
                status === 'warning' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: getProgressBarWidth() }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            {getProgressPercentage().toFixed(1)}% of monthly limit used
          </p>
        </div>
      </div>
    </div>
  );
};
