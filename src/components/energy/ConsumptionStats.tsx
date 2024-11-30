import { Reading } from '../types';
import { MONTHLY_LIMIT } from './constants';

interface ConsumptionStatsProps {
  readings: Reading[];
  status: 'alert' | 'warning' | 'success';
}

export function ConsumptionStats({ readings, status }: ConsumptionStatsProps) {
  const getTotalConsumption = () => {
    return readings.slice(1).reduce((sum, reading, index) => {
      const consumption = reading.value - readings[index].value;
      return sum + consumption;
    }, 0);
  };

  const getAverageDailyConsumption = () => {
    const total = getTotalConsumption();
    const days = readings.length - 1; // Subtract 1 because first reading has no consumption
    return days > 0 ? (total / days).toFixed(2) : '0';
  };

  const getDaysRemaining = () => {
    if (readings.length === 0) return 0;
    const startDate = new Date(readings[0].date.split('/').reverse().join('-'));
    const lastDate = new Date(startDate);
    lastDate.setDate(startDate.getDate() + 30);
    const currentDate = new Date();
    const remaining = Math.ceil((lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, remaining);
  };

  const getRemainingDaily = () => {
    const daysLeft = getDaysRemaining();
    if (daysLeft <= 0) return '0.00';
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
