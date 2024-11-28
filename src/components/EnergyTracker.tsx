"use client"

import { useState } from "react";
import { readings as initialReadings } from "@/data/readings";
import ConsumptionChart from "./energy/ConsumptionChart";
import ReadingForm from "./energy/ReadingForm";
import { ReadingsTable } from "./energy/ReadingsTable";
import { processReadings } from "@/utils/processReadings";
import type { Reading } from "@/components/types";

export default function EnergyTracker() {
  const [readings, setReadings] = useState<Reading[]>(initialReadings);

  const addReading = (value: number) => {
    const newReading = {
      date: new Date().toLocaleDateString("en-GB"),
      value
    };
    setReadings([...readings, newReading]);
  };

  const processedReadings = processReadings(readings);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Energy Consumption Tracker</h1>
      <ReadingForm onSubmit={addReading} />
      <ConsumptionChart data={processedReadings} />
      <ReadingsTable readings={processedReadings} />
    </div>
  );
}
