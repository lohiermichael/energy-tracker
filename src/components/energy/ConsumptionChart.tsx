import CumulativeMeterChart from '@/components/energy/CumulativeMeterChart';
import DailyConsumptionChart from '@/components/energy/DailyConSumptionChart';

interface ConsumptionChartProps {
  data: Array<{
    date: string;
    value: number;
    consumption: number;
  }>;
}

export default function ConsumptionCharts({ data }: ConsumptionChartProps) {

  return (
    <div className="space-y-8">
      <DailyConsumptionChart data={data} />
      <CumulativeMeterChart data={data} />
    </div>
  );
}
