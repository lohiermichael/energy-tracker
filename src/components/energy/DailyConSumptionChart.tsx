import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps
} from 'recharts';
import { DAILY_SAFE, DAILY_MAX, DAILY_EXTRA_CHARGE } from './constants';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
  active,
  payload,
  label
}) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-white p-3 border rounded shadow-lg space-y-1">
      <p className="font-medium">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color }}>
          {entry.name}: {Number(entry.value).toFixed(2)} kWh
        </p>
      ))}
      <p style={{ color: 'green' }}>
        Safe Target: {DAILY_SAFE.toFixed(2)} kWh
      </p>
      <p style={{ color: 'purple' }}>
        Max Target: {DAILY_MAX.toFixed(2)} kWh
      </p>
      <p style={{ color: 'red' }}>
        Extra Charge Target: {DAILY_EXTRA_CHARGE.toFixed(2)} kWh
      </p>
    </div>
  );
};

interface DailyConsumptionChartProps {
  data: Array<{
    date: string;
    consumption: number;
  }>;
}

export default function DailyConsumptionChart({ 
  data 
}: DailyConsumptionChartProps) {
  const getConsumptionDomain = () => {
    const maxConsumption = Math.max(
      ...data.map(d => d.consumption),
      DAILY_EXTRA_CHARGE
    );
    const minConsumption = Math.min(...data.map(d => d.consumption), 0);
    return [Math.floor(minConsumption - 0.5), Math.ceil(maxConsumption + 0.5)];
  };

  const referenceLines = [
    { y: DAILY_SAFE, stroke: "green", label: "Safe Limit" },
    { y: DAILY_MAX, stroke: "purple", label: "Max Limit" },
    { y: DAILY_EXTRA_CHARGE, stroke: "red", label: "Extra Charge Limit" }
  ];

  const formatYAxis = (value: number) => value.toFixed(2);

  return (
    <div className="w-full">
      <h3 className="font-medium mb-2">Daily Consumption</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              domain={getConsumptionDomain()} 
              tickFormatter={formatYAxis} 
            />
            <Tooltip content={CustomTooltip} />
            <Legend />
            <Bar 
              dataKey="consumption" 
              fill="#2563eb" 
              name="Daily Usage" 
            />
            {referenceLines.map((line, index) => (
              <ReferenceLine
                key={index}
                y={line.y}
                stroke={line.stroke}
                strokeDasharray="3 3"
                label={{ 
                  value: line.label, 
                  fill: line.stroke, 
                  position: 'right' 
                }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
