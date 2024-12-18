import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { DAILY_SAFE, DAILY_MAX, DAILY_EXTRA_CHARGE } from './constants';

interface CumulativeData {
  date: string;
  meterReading: number;
  safeTarget: number;
  maxTarget: number;
  extraChargeTarget: number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-white p-3 border rounded shadow-lg space-y-1">
      <p className="font-medium">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color }}>
          {entry.name}: {Number(entry.value).toFixed(2)} kWh
        </p>
      ))}
    </div>
  );
};

interface CumulativeMeterChartProps {
  data: Array<{
    date: string;
    value: number;
    consumption: number;
  }>;
}

export default function CumulativeMeterChart({ 
  data 
}: CumulativeMeterChartProps) {
  const generateCumulativeData = (): CumulativeData[] => {
    if (data.length === 0) return [];

    const previousValue = data[0].value - data[0].consumption;

    return data.map((reading, index) => {
      const daysFromStart = index + 1;
      return {
        date: reading.date,
        meterReading: Number(reading.value.toFixed(2)),
        safeTarget: Number(
          (previousValue + DAILY_SAFE * daysFromStart).toFixed(2)
        ),
        maxTarget: Number(
          (previousValue + DAILY_MAX * daysFromStart).toFixed(2)
        ),
        extraChargeTarget: Number(
          (previousValue + DAILY_EXTRA_CHARGE * daysFromStart).toFixed(2)
        ),
      };
    });
  };

  const cumulativeData = generateCumulativeData();

  const getCumulativeDomain = () => {
    if (cumulativeData.length === 0) return [0, 100];
    
    const allValues = cumulativeData.flatMap(d => [
      d.meterReading,
      d.safeTarget,
      d.maxTarget,
      d.extraChargeTarget
    ]);
    
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const padding = (max - min) * 0.05;
    
    return [min - padding, max + padding];
  };

  const formatYAxis = (value: number) => value.toFixed(2);

  return (
    <div className="w-full">
      <h3 className="font-medium mb-2">Cumulative Meter Readings</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <LineChart data={cumulativeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              domain={getCumulativeDomain()} 
              tickFormatter={formatYAxis} 
            />
            <Tooltip content={CustomTooltip} />
            <Legend />
            <Line
              type="monotone"
              dataKey="meterReading"
              stroke="#2563eb"
              name="Actual Reading"
            />
            <Line
              type="monotone"
              dataKey="safeTarget"
              stroke="green"
              strokeDasharray="3 3"
              name="Safe Target"
            />
            <Line
              type="monotone"
              dataKey="maxTarget"
              stroke="purple"
              strokeDasharray="3 3"
              name="Max Target"
            />
            <Line
              type="monotone"
              dataKey="extraChargeTarget"
              stroke="red"
              strokeDasharray="3 3"
              name="Extra Charge Target"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
