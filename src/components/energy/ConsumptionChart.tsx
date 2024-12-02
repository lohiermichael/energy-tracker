import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
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
  const [barRight, setBarRight] = useState<string | undefined>();

  const dailyData = data.slice(1).map(reading => ({
    date: reading.date,
    consumption: reading.consumption,
  }));

  const cumulativeData = data.map((reading, index) => ({
    date: reading.date,
    meterReading: Number(reading.value.toFixed(2)),
    safeTarget: Number((data[0].value + (DAILY_SAFE * index)).toFixed(2)),
    maxTarget: Number((data[0].value + (DAILY_MAX * index)).toFixed(2)),
    extraChargeTarget: Number(
      (data[0].value + (DAILY_EXTRA_CHARGE * index)).toFixed(2)
    ),
  }));

  const minConsumption = Math.min(...dailyData.map(d => d.consumption));

  const handleBarMouseDown = (e: ChartEvent) => {
    if (e) setBarLeft(e.activeLabel);
  };

  const handleBarMouseMove = (e: ChartEvent) => {
    if (barLeft && e) setBarRight(e.activeLabel);
  };

  const formatYAxis = (value: number) => value.toFixed(2);
  const formatTooltip = (value: number | string) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value;
  };

  // Rest of the component remains the same


  return (
    <div className="space-y-8">
      <div className="w-full">
        <h3 className="font-medium mb-2">Daily Consumption</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <BarChart 
              data={dailyData}
              onMouseDown={handleBarMouseDown}
              onMouseMove={handleBarMouseMove}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis 
                domain={[minConsumption - 0.5, DAILY_MAX + 0.5]} 
                tickFormatter={formatYAxis}
              />
              <Tooltip formatter={formatTooltip} />
              <Legend />
              <Bar dataKey="consumption" fill="#2563eb" name="Daily Usage" />
              <ReferenceLine
                y={DAILY_SAFE}
                stroke="green"
                strokeDasharray="3 3"
                label={{ value: 'Safe Limit', fill: 'green', position: 'right' }} />
              <ReferenceLine
                y={DAILY_MAX}
                stroke="purple"
                strokeDasharray="3 3"
                label={{ value: 'Max Limit', fill: 'purple', position: 'right' }} />
              <ReferenceLine
                y={DAILY_EXTRA_CHARGE}
                stroke="red"
                strokeDasharray="3 3"
                label={{ value: 'Extra Charge Limit', fill: 'red', position: 'right' }} />
              {barLeft && barRight && (
                <ReferenceArea
                  x1={barLeft}
                  x2={barRight}
                  strokeOpacity={0.3}
                  fill="#2563eb"
                  fillOpacity={0.1}
                />
              )}
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
                domain={['dataMin - 1', 'dataMax + 1']} 
                tickFormatter={formatYAxis}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="meterReading"
                stroke="#2563eb"
                name="Actual Reading" />
              <Line
                type="monotone"
                dataKey="safeTarget"
                stroke="green"
                strokeDasharray="3 3"
                name="Safe Target" />
              <Line
                type="monotone"
                dataKey="maxTarget"
                stroke="purple"
                strokeDasharray="3 3"
                name="Max Target" />
              <Line
                type="monotone"
                dataKey="extraChargeTarget"
                stroke="red"
                strokeDasharray="3 3"
                name="Extra Charge Target" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
