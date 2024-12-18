import React from 'react';
import { 
  Battery, 
  Calendar, 
  Target, 
  Zap
} from 'lucide-react';
import { ProcessedReading } from '../types';
import { MONTHLY_LIMIT } from './constants';

interface ConsumptionStatsProps {
  readings: ProcessedReading[];  // Changed from Reading[] to ProcessedReading[]
  status: 'alert' | 'warning' | 'success';
}

const ConsumptionStats = ({ readings, status }: ConsumptionStatsProps) => {

  const getTotalConsumption = () => {
    if (readings.length === 0) return 0;
    
    // Sum all consumptions
    return readings.reduce((sum, reading) => {
      return sum + reading.consumption;
    }, 0);
  };

  const getAverageDailyConsumption = () => {
    const total = getTotalConsumption();
    // Use total number of readings as the number of days
    const days = readings.length;
    return days > 0 ? (total / days).toFixed(2) : '0.00';
  };

  const getDaysRemaining = () => {
    if (readings.length === 0) return 0;

    // Get the first reading's date to determine which period we're viewing
    const firstReading = readings[0];
    const [day, month, year] = firstReading.date.split('/').map(Number);
    
    // If it's a past period, return 0
    const now = new Date();
    const periodDate = new Date(year, month - 1, day);
    if (periodDate.getMonth() < now.getMonth() || 
        periodDate.getFullYear() < now.getFullYear()) {
      return 0;
    }

    // For current period, calculate remaining days until next billing cycle
    const daysInPeriod = 30;
    const daysElapsed = readings.length;
    return Math.max(0, daysInPeriod - daysElapsed);
  };

  const getRemainingDaily = () => {
    const daysLeft = getDaysRemaining();
    if (daysLeft <= 0) return '0.00';
    
    // Calculate total consumption so far
    const totalUsed = getTotalConsumption();
    
    // How many kWh remaining until 200 kWh
    const remainingUntilLimit = 200 - totalUsed;
    
    // If we've already exceeded 200 kWh, return 0
    if (remainingUntilLimit <= 0) return '0.00';
    
    // Calculate how much we can use per day to reach exactly 200 kWh
    const dailyTarget = remainingUntilLimit / daysLeft;
    
    return dailyTarget.toFixed(2);
  };

  const getProgressPercentage = () => {
    const total = getTotalConsumption();
    return (total / MONTHLY_LIMIT) * 100;
  };

  const getProgressBarWidth = () => {
    const percentage = getProgressPercentage();
    return `${Math.min(percentage, 100)}%`;
  };

  // Rest of the component remains the same...
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

export default ConsumptionStats;
