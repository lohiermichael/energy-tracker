"use client";

import { useState } from "react";
import { readings as initialReadings } from "@/data/readings";
import ConsumptionChart from "./energy/ConsumptionChart";
import ReadingForm from "./energy/ReadingForm";

export default function EnergyTracker() {
  const [readings, setReadings] = useState(initialReadings);

  const addReading = (value: number) => {
    const newReading = {
      date: new Date().toLocaleDateString("en-GB"),
      value,
      consumption: value - readings[readings.length - 1].value
    };
    setReadings([...readings, newReading]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Energy Consumption Tracker</h1>
      <ReadingForm onSubmit={addReading} />
      <ConsumptionChart data={readings} />
    </div>
  );
}
