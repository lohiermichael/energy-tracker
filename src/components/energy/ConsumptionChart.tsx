"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ConsumptionChartProps {
  data: Array<{
    date: string;
    consumption: number;
  }>;
}

export default function ConsumptionChart({ data }: ConsumptionChartProps) {
  return (
    <div className="w-full h-64">
      <LineChart width={600} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="consumption" stroke="#2563eb" />
      </LineChart>
    </div>
  );
}
