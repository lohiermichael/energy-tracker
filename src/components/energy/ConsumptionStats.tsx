import { Reading } from '../types';
import { MONTHLY_LIMIT } from './constants';

interface ConsumptionStatsProps {
  readings: Reading[];
  status: 'alert' | 'warning' | 'success';
}

export function ConsumptionStats({ readings, status }: ConsumptionStatsProps) {
  const getTotalConsumption = () => 
    readings.reduce((sum, reading) => sum + reading.consumption, 0);

  const getAverageDailyConsumption = () => {
    const total = getTotalConsumption();
    const days = readings.length;
    return days > 0 ? (total / days).toFixed(2) : '0';
  };

  const getDaysRemaining = () => {
    const startDate = new Date(readings[0].date);
    const currentDate = new Date();
    return 30 - Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getRemainingDaily = () => {
    const daysLeft = getDaysRemaining();
    if (daysLeft <= 0) return 0;
    const remaining = MONTHLY_LIMIT - getTotalConsumption();
    return (remaining / daysLeft).toFixed(2);
  };

  return (
    <div className={`p-4 rounded ${
      status === 'alert' ? 'bg-red-100' :
      status === 'warning' ? 'bg-yellow-100' :
      'bg-green-100'
    }`}>
      <div className="space-y-2">
        <p>Total consumption: {getTotalConsumption().toFixed(2)} kWh</p>
        <p>Average daily consumption: {getAverageDailyConsumption()} kWh</p>
        <p>Remaining daily target: {getRemainingDaily()} kWh</p>
        <p>Days remaining: {getDaysRemaining()}</p>
      </div>
    </div>
  );
}
