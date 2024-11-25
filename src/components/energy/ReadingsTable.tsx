import { Reading } from "../types";

export function ReadingsTable({ readings }: { readings: Reading[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Date</th>
            <th className="text-right">Reading (kWh)</th>
            <th className="text-right">Consumption</th>
          </tr>
        </thead>
        <tbody>
          {readings.map((reading, index) => (
            <tr key={index} className="border-t">
              <td className="py-2">{reading.date}</td>
              <td className="text-right">{reading.value}</td>
              <td className="text-right">{reading.consumption.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
