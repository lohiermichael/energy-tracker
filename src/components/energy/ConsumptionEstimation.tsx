import React from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { ProcessedReading } from '../types';

interface ConsumptionEstimationProps {
  readings: ProcessedReading[];
}

const ConsumptionEstimation = ({ readings }: ConsumptionEstimationProps) => {
  if (readings.length < 2) return null;

  const getTotalDays = () => {
    const firstDate = new Date(readings[0].date.split('/').reverse().join('-'));
    const lastDate = new Date(
      readings[readings.length - 1].date.split('/').reverse().join('-')
    );
    return Math.ceil((lastDate.getTime() - firstDate.getTime()) 
      / (1000 * 60 * 60 * 24));
  };

  const calculateProjection = () => {
    const totalConsumption = readings.slice(1).reduce(
      (sum, reading) => sum + reading.consumption, 
      0
    );
    const days = getTotalDays();
    const avgDaily = totalConsumption / days;
    const projectedMonthly = avgDaily * 30;
    
    // Calculate excess over 200 kWh
    const excess = Math.max(0, projectedMonthly - 200);
    // Calculate fee where 230 kWh excess = €100
    const extraFee = (excess * 100) / 230;

    return {
      avgDaily,
      projectedMonthly,
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
