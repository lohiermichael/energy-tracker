import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { DAILY_SAFE, DAILY_MAX, DAILY_EXTRA_CHARGE } from './constants';
import { useState } from 'react';

interface ConsumptionChartProps {
  data: Array<{
    date: string;
    value: number;
    consumption: number;
  }>;
}

interface ChartEvent {
  activeLabel?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  type?: 'daily' | 'cumulative';
}

const CustomTooltip = ({ active, payload, label, type }: CustomTooltipProps) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-white p-3 border rounded shadow-lg space-y-1">
      <p className="font-medium">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} style={{ color: entry.color }}>
          {entry.name}: {Number(entry.value).toFixed(2)} kWh
        </p>
      ))}
      {type === 'daily' && (
        <>
          <p style={{ color: 'green' }}>
            Safe Target: {DAILY_SAFE.toFixed(2)} kWh
          </p>
          <p style={{ color: 'purple' }}>
            Max Target: {DAILY_MAX.toFixed(2)} kWh
          </p>
          <p style={{ color: 'red' }}>
            Extra Charge Target: {DAILY_EXTRA_CHARGE.toFixed(2)} kWh
          </p>
        </>
      )}
    </div>
  );
};

export default function ConsumptionCharts({ data }: ConsumptionChartProps) {
  const [barLeft, setBarLeft] = useState<string | undefined>();
  const setBarRight = useState<string | undefined>()[1];

  const dailyData = data.map(reading => ({
    date: reading.date,
    consumption: reading.consumption,
  }));

  const generateCumulativeData = () => {
    if (data.length === 0) return [];

    const firstReading = data[0];
    const baseValue = firstReading.value;
    const allDates = data.map(r => r.date);

    return allDates.map((date, index) => {
      const actualReading = data.find(r => r.date === date)?.value || baseValue;

      return {
        date,
        meterReading: Number(actualReading.toFixed(2)),
        safeTarget: Number((baseValue + (DAILY_SAFE * index)).toFixed(2)),
        maxTarget: Number((baseValue + (DAILY_MAX * index)).toFixed(2)),
        extraChargeTarget: Number(
          (baseValue + (DAILY_EXTRA_CHARGE * index)).toFixed(2)
        ),
      };
    });
  };

  const cumulativeData = generateCumulativeData();

  const getConsumptionDomain = () => {
    const maxConsumption = Math.max(
      ...dailyData.map(d => d.consumption),
      DAILY_EXTRA_CHARGE
    );
    const minConsumption = Math.min(...dailyData.map(d => d.consumption), 0);
    return [Math.floor(minConsumption - 0.5), Math.ceil(maxConsumption + 0.5)];
  };

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

  const referenceLines = [
    { y: DAILY_SAFE, stroke: "green", label: "Safe Limit" },
    { y: DAILY_MAX, stroke: "purple", label: "Max Limit" },
    { y: DAILY_EXTRA_CHARGE, stroke: "red", label: "Extra Charge Limit" }
  ];

  const formatYAxis = (value: number) => value.toFixed(2);

  return (
    <div className="space-y-8">
      <div className="w-full">
        <h3 className="font-medium mb-2">Daily Consumption</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <BarChart 
              data={dailyData}
              onMouseDown={(e: ChartEvent) => 
                e?.activeLabel && setBarLeft(e.activeLabel)}
              onMouseMove={(e: ChartEvent) => 
                barLeft && e?.activeLabel && setBarRight(e.activeLabel)}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={getConsumptionDomain()} tickFormatter={formatYAxis} />
              <Tooltip 
                content={props => <CustomTooltip {...props} type="daily" />}
              />
              <Legend />
              <Bar dataKey="consumption" fill="#2563eb" name="Daily Usage" />
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

      <div className="w-full">
        <h3 className="font-medium mb-2">Cumulative Meter Readings</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <LineChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={getCumulativeDomain()} tickFormatter={formatYAxis} />
              <Tooltip 
                content={props => <CustomTooltip {...props} type="cumulative" />}
              />
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
    </div>
  );
}
