import { Gauge } from "lucide-react";

export default function EnergyHeader() {
  return (
    <div className="flex items-center space-x-3 px-2 py-6">
      <div className="animate-bounce-gentle">
        <Gauge 
          className="w-10 h-10 text-blue-500 transition-colors duration-300 
            hover:text-blue-600" 
        />
      </div>
      <div className="animate-fade-in">
        <h1 className="text-4xl font-semibold text-gray-800 hover:text-blue-500 
          transition-colors duration-300">
          Energy Tracker
        </h1>
        <p className="text-gray-500 animate-slide-in">
          Track your daily consumption
        </p>
      </div>
    </div>
  );
}
