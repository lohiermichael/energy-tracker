"use client"

import { useEnergyReadings } from "./energy/hooks/useEnergyReadings";
import ConsumptionChart from "./energy/ConsumptionChart";
import ReadingForm from "./energy/ReadingForm";
import { EditableReadingsTable } from "./energy/EditableReadingsTable";
import { ConsumptionStats } from "./energy/ConsumptionStats";
import { processReadings } from "@/utils/processReadings";
import { DAILY_SAFE, DAILY_MAX } from "./energy/constants";

export default function EnergyTracker() {
  const { readings, error, addReading } = useEnergyReadings();

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  const processedReadings = processReadings(readings);
  
  const getStatus = () => {
    if (processedReadings.length === 0) return 'success';
    const lastReading = processedReadings[processedReadings.length - 1];
    if (lastReading.consumption > DAILY_MAX) return 'alert';
    if (lastReading.consumption > DAILY_SAFE) return 'warning';
    return 'success';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <h1 className="text-3xl font-bold">Energy Consumption Tracker</h1>
      <ReadingForm onSubmit={addReading} />
      {processedReadings.length > 0 ? (
        <>
          <ConsumptionStats 
            readings={processedReadings} 
            status={getStatus()} 
          />
          <ConsumptionChart data={processedReadings} />
          <EditableReadingsTable readings={processedReadings} />
        </>
      ) : (
        <p className="text-center text-gray-500">No readings available. Add your first reading above.</p>
      )}
    </div>
  );
}
