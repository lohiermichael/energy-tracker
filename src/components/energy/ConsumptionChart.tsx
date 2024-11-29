import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { DAILY_SAFE, DAILY_MAX, DAILY_EXTRA_CHARGE } from './constants';
import { useState } from 'react';

interface ConsumptionChartProps {
  data: Array<{
    date: string;
    value: number;
    consumption: number;
  }>;
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
    meterReading: reading.value,
    safeTarget: data[0].value + (DAILY_SAFE * index),
    maxTarget: data[0].value + (DAILY_MAX * index),
    extraChargeTarget: data[0].value + (DAILY_EXTRA_CHARGE * index),
  }));

  const minConsumption = Math.min(...dailyData.map(d => d.consumption));

  const handleBarMouseDown = (e: any) => {
    if (e) setBarLeft(e.activeLabel);
  };

  const handleBarMouseMove = (e: any) => {
    if (barLeft && e) setBarRight(e.activeLabel);
  };

  const handleBarMouseUp = () => {
    if (barLeft && barRight) {
      const startIndex = dailyData.findIndex(d => d.date === barLeft);
      const endIndex = dailyData.findIndex(d => d.date === barRight);
      if (startIndex !== endIndex) {
        const newData = dailyData.slice(
          Math.min(startIndex, endIndex),
          Math.max(startIndex, endIndex) + 1
        );
        // Update zoom here
      }
    }
    setBarLeft(undefined);
    setBarRight(undefined);
  };

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
              onMouseUp={handleBarMouseUp}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[minConsumption - 0.5, DAILY_MAX + 0.5]} />
              <Tooltip />
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
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
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
