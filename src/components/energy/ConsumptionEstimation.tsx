import React from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { ProcessedReading } from '../types';

interface ConsumptionEstimationProps {
  currentReadings: ProcessedReading[];
  allReadings: ProcessedReading[];
}

const ConsumptionEstimation = ({ 
  currentReadings, 
  allReadings 
}: ConsumptionEstimationProps) => {
  if (currentReadings.length === 0 || allReadings.length === 0) return null;

  // Calculate days since first ever reading
  const getTotalHistoricalDays = () => {
    const firstReading = allReadings[0];
    const lastReading = allReadings[allReadings.length - 1];
    
    const firstDate = new Date(firstReading.date.split('/').reverse().join('-'));
    const lastDate = new Date(lastReading.date.split('/').reverse().join('-'));
    
    return Math.max(1, Math.ceil(
      (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
    ));
  };

  const calculateProjection = () => {
    const daysInPeriod = 30;
    
    // Calculate total historical consumption
    const totalHistoricalConsumption = allReadings.reduce(
      (sum, reading) => sum + (reading.consumption || 0),
      0
    );
    
    // Calculate average based on all historical data
    const totalDays = getTotalHistoricalDays();
    const avgDaily = totalHistoricalConsumption / totalDays;

    // Current period consumption from filtered readings
    const currentPeriodConsumption = currentReadings.reduce(
      (sum, reading) => sum + (reading.consumption || 0),
      0
    );
    
    // Calculate remaining days in current period
    const daysElapsed = currentReadings.length;
    const remainingDays = daysInPeriod - daysElapsed;
    const estimatedRemaining = avgDaily * remainingDays;
    
    const projectedMonthly = currentPeriodConsumption + estimatedRemaining;
    
    // Calculate excess over 200 kWh
    const excess = Math.max(0, projectedMonthly - 200);
    // Calculate fee where 230 kWh excess = €100
    const extraFee = (excess * 100) / 230;

    return {
      avgDaily,
      projectedMonthly,
      remainingDays,
      estimatedRemaining,
      excess,
      extraFee
    };
  };

  const projection = calculateProjection();

  const getStatusColor = () => {
    if (projection.projectedMonthly > 430) return 'text-red-600';
    if (projection.projectedMonthly > 200) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="p-6 rounded-lg bg-white border">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        Monthly Projection
      </h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-gray-600">Average Daily Consumption</p>
          <p className="text-xl font-semibold">
            {projection.avgDaily.toFixed(2)} kWh
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Projected Monthly Usage</p>
          <p className={`text-xl font-semibold ${getStatusColor()}`}>
            {projection.projectedMonthly.toFixed(2)} kWh
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Days Remaining in Period</p>
          <p className="text-xl font-semibold">{projection.remainingDays}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Estimated Remaining Usage</p>
          <p className="text-xl font-semibold">
            {projection.estimatedRemaining.toFixed(2)} kWh
          </p>
        </div>
      </div>

      {projection.excess > 0 && (
        <div className="mt-4 p-4 rounded-lg bg-red-50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">
                Extra charge warning
              </p>
              <p className="text-sm text-red-700 mt-1">
                Projected {projection.excess.toFixed(2)} kWh over limit
                <br />
                Estimated extra fee: €{projection.extraFee.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumptionEstimation;
