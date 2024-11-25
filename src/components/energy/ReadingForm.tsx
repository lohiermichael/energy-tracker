"use client";

import { useState } from "react";

interface ReadingFormProps {
  onSubmit: (reading: number) => void;
}

export default function ReadingForm({ onSubmit }: ReadingFormProps) {
  const [newReading, setNewReading] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(newReading);
    if (isNaN(value)) return;
    onSubmit(value);
    setNewReading('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="number"
        step="0.01"
        value={newReading}
        onChange={(e) => setNewReading(e.target.value)}
        placeholder="New reading (kWh)"
        className="flex-1 p-2 border rounded"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Add
      </button>
    </form>
  );
}
