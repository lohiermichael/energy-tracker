"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useEnergyReadings } from "@/components/energy/hooks/useEnergyReadings";
import ConsumptionChart from "@/components/energy/ConsumptionChart";
import ReadingForm from "@/components/energy/ReadingForm";
import { EditableReadingsTable } from "@/components/energy/EditableReadingsTable";
import ConsumptionStats from "@/components/energy/ConsumptionStats";
import ConsumptionEstimation from "@/components/energy/ConsumptionEstimation";
import MonthlyTabs from "@/components/energy/MonthlyTabs";
import { processReadings } from "@/utils/processReadings";
import { DAILY_SAFE, DAILY_MAX } from "@/components/energy/constants";
import type { ProcessedReading } from "@/components/types";

export default function EnergyTracker() {
  const { readings, error, isLoading, addReading } = useEnergyReadings();
  const [filteredReadings, setFilteredReadings] = useState<ProcessedReading[]>([]);
  
  const processedReadings = useMemo(() => processReadings(readings), [readings]);

  // Get current period
  const getCurrentPeriodKey = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    if (day < 16) {
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      return `${prevMonth}/${prevYear}`;
    }
    return `${month}/${year}`;
  };

  const [activePeriod, setActivePeriod] = useState(getCurrentPeriodKey);

  const periods = useMemo(() => {
    const uniquePeriods = new Map<string, ProcessedReading[]>();
    
    processedReadings.forEach(reading => {
      const [day, month, year] = reading.date.split('/').map(Number);
      let periodKey: string;
      
      if (day < 16) {
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        periodKey = `${prevMonth}/${prevYear}`;
      } else {
        periodKey = `${month}/${year}`;
      }
      
      const existing = uniquePeriods.get(periodKey) || [];
      uniquePeriods.set(periodKey, [...existing, reading]);
    });
    
    return uniquePeriods;
  }, [processedReadings]);

  // Update filtered readings when periods or active period changes
  useEffect(() => {
    const periodReadings = periods.get(activePeriod) || [];

    // Find the last reading from previous period if it exists
    if (periodReadings.length > 0) {
      const [day, month, year] = periodReadings[0].date.split('/').map(Number);
      const firstReadingDate = new Date(year, month - 1, day);
      
      // Find the last reading before this period's first reading
      const previousReading = processedReadings.find(reading => {
        const [d, m, y] = reading.date.split('/').map(Number);
        const readingDate = new Date(y, m - 1, d);
        return readingDate < firstReadingDate;
      });
      
      if (previousReading) {
        // Include the previous reading at the start, but marked with 
        // consumption = 0 since it's from previous period
        setFilteredReadings([
          { ...previousReading, consumption: 0 },
          ...periodReadings
        ]);
      } else {
        setFilteredReadings(periodReadings);
      }
    } else {
      setFilteredReadings([]);
    }

  }, [periods, activePeriod]);

  const handlePeriodChange = (period: string) => {
    setActivePeriod(period);
  };
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse 
            delay-150" />
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse 
            delay-300" />
          <span className="text-gray-600 ml-2">Loading energy data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div 
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 
            rounded relative" 
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }
  
  const getStatus = () => {
    if (filteredReadings.length === 0) return 'success';
    const lastReading = filteredReadings[filteredReadings.length - 1];
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
          <MonthlyTabs 
            readings={processedReadings}
            activePeriod={activePeriod}
            onPeriodChange={handlePeriodChange}
          />
          {filteredReadings.length > 0 && (
            <>
              <ConsumptionStats 
                readings={filteredReadings} 
                status={getStatus()} 
              />
              <ConsumptionEstimation 
                currentReadings={filteredReadings}
                allReadings={processedReadings} 
              />
              <ConsumptionChart data={filteredReadings} />
              <EditableReadingsTable readings={filteredReadings} />
            </>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No readings available yet.</p>
          <p className="text-gray-400 text-sm mt-2">
            Add your first reading using the form above.
          </p>
        </div>
      )}
    </div>
  );
}
