
import { useState } from "react";
import { Reading } from "../types";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface EditableReadingsTableProps {
  readings: Reading[];
}

export function EditableReadingsTable({ readings }: EditableReadingsTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (index: number, value: number) => {
    setEditingId(index);
    setEditValue(value.toString());
    setError(null);
  };

  const handleSave = async (reading: Reading, index: number) => {
    try {
      if (!reading.id) {
        setError("Cannot update reading: missing ID");
        return;
      }

      const newValue = parseFloat(editValue);
      
      // Validation
      if (isNaN(newValue)) {
        setError("Please enter a valid number");
        return;
      }

      if (newValue < 0) {
        setError("Reading cannot be negative");
        return;
      }

      if (index > 0 && newValue < readings[index - 1].value) {
        setError("New reading cannot be less than the previous reading");
        return;
      }

      if (index < readings.length - 1 && newValue > readings[index + 1].value) {
        setError("New reading cannot be greater than the next reading");
        return;
      }

      setIsSaving(true);

      const readingRef = doc(db, "readings", reading.id);
      await updateDoc(readingRef, {
        value: newValue,
        date: reading.date,
      });

      setEditingId(null);
      setError(null);
      setIsSaving(false);
    } catch (err) {
      setIsSaving(false);
      console.error("Error updating reading:", err);
      setError("Failed to update reading. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, reading: Reading, index: number) => {
    if (e.key === "Enter") {
      handleSave(reading, index);
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Date</th>
              <th className="text-right">Reading (kWh)</th>
              <th className="text-right">Consumption</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading, index) => (
              <tr key={reading.id || index} className="border-t">
                <td className="py-2">{reading.date}</td>
                <td className="text-right">
                  {editingId === index ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, reading, index)}
                      className="w-24 p-1 border rounded text-right"
                      autoFocus
                      disabled={isSaving}
                    />
                  ) : (
                    reading.value
                  )}
                </td>
                <td className="text-right">{reading.consumption.toFixed(2)}</td>
                <td className="text-right space-x-2">
                  {editingId === index ? (
                    <>
                      <button
                        onClick={() => handleSave(reading, index)}
                        className={`text-green-600 hover:text-green-800 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className={`text-red-600 hover:text-red-800 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(index, reading.value)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && (
        <div className="text-red-600 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
}
