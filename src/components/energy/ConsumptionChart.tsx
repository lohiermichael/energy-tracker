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

export default function ConsumptionCharts({ data }: ConsumptionChartProps) {
  const [barLeft, setBarLeft] = useState<string | undefined>();
  // Remove unused state variable and keep only setBarRight
  const setBarRight = useState<string | undefined>()[1];

  // For the daily chart, we can use consumption directly
  const dailyData = data.map(reading => ({
    date: reading.date,
    consumption: reading.consumption,
  }));

  // For cumulative chart, we need to calculate targets based on first reading
  const generateCumulativeData = () => {
    if (data.length === 0) return [];

    const firstReading = data[0];
    const baseValue = firstReading.value;

    // Create dates array starting from the first reading
    const allDates = data.map(r => r.date);

    return allDates.map((date, index) => {
      const actualReading = data.find(r => r.date === date)?.value || 
        baseValue;

      return {
        date,
        meterReading: Number(actualReading.toFixed(2)),
        safeTarget: Number(
          (baseValue + (DAILY_SAFE * index)).toFixed(2)
        ),
        maxTarget: Number(
          (baseValue + (DAILY_MAX * index)).toFixed(2)
        ),
        extraChargeTarget: Number(
          (baseValue + (DAILY_EXTRA_CHARGE * index)).toFixed(2)
        ),
      };
    });
  };

  const cumulativeData = generateCumulativeData();

  // Calculate appropriate domain for consumption chart
  const getConsumptionDomain = () => {
    const maxConsumption = Math.max(
      ...dailyData.map(d => d.consumption),
      DAILY_EXTRA_CHARGE
    );
    const minConsumption = Math.min(
      ...dailyData.map(d => d.consumption),
      0
    );
    return [
      Math.floor(minConsumption - 0.5), 
      Math.ceil(maxConsumption + 0.5)
    ];
  };

  // Calculate appropriate domain for cumulative chart
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
  const formatTooltip = (value: number | string) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value;
  };

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
              <YAxis 
                domain={getConsumptionDomain()}
                tickFormatter={formatYAxis}
              />
              <Tooltip formatter={formatTooltip} />
              <Legend />
              <Bar 
                dataKey="consumption" 
                fill="#2563eb" 
                name="Daily Usage"
              />
              <ReferenceLine
                y={DAILY_SAFE}
                stroke="green"
                strokeDasharray="3 3"
                label={{ 
                  value: 'Safe Limit', 
                  fill: 'green', 
                  position: 'right' 
                }}
              />
              <ReferenceLine
                y={DAILY_MAX}
                stroke="purple"
                strokeDasharray="3 3"
                label={{ 
                  value: 'Max Limit', 
                  fill: 'purple', 
                  position: 'right' 
                }}
              />
              <ReferenceLine
                y={DAILY_EXTRA_CHARGE}
                stroke="red"
                strokeDasharray="3 3"
                label={{ 
                  value: 'Extra Charge Limit', 
                  fill: 'red', 
                  position: 'right' 
                }}
              />
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
              <YAxis 
                domain={getCumulativeDomain()}
                tickFormatter={formatYAxis}
              />
              <Tooltip formatter={formatTooltip} />
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
