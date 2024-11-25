'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Bell, BellOff } from 'lucide-react';

const INITIAL_READING = 3835.2;
const DAILY_SAFE = 6;
const DAILY_MAX = 6.66;
const MONTHLY_LIMIT = DAILY_MAX * 30;

export default function EnergyTracker() {
  const [readings, setReadings] = useState<Array<{
    date: string;
    value: number;
    consumption: number;
  }>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('energyReadings');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [newReading, setNewReading] = useState('');
  const [notifications, setNotifications] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('energyNotifications');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('energyReadings', JSON.stringify(readings));
    localStorage.setItem('energyNotifications', JSON.stringify(notifications));

    if (notifications && readings.length > 0) {
      const lastReading = readings[readings.length - 1];
      const total = getTotalConsumption();
      
      if (lastReading.consumption > DAILY_SAFE) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Energy Alert', {
            body: `Daily consumption (${lastReading.consumption.toFixed(2)} kWh) above safe target (${DAILY_SAFE} kWh)`,
          });
        }
      }

      if ((30 - readings.length) <= 5) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Monthly Reset Soon', {
            body: `${30 - readings.length} days left in current tracking period`,
          });
        }
      }
    }
  }, [readings, notifications]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotifications(true);
      }
    }
  };

  const addReading = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(newReading);
    if (isNaN(value)) return;

    const newEntry = {
      date: new Date().toLocaleDateString(),
      value: value,
      consumption: readings.length > 0 
        ? value - readings[readings.length - 1].value 
        : value - INITIAL_READING
    };

    setReadings([...readings, newEntry]);
    setNewReading('');
  };

  const getTotalConsumption = () => {
    return readings.reduce((sum, reading) => sum + reading.consumption, 0);
  };

  const getRemainingDaily = () => {
    const daysLeft = 30 - readings.length;
    if (daysLeft <= 0) return 0;
    const remaining = MONTHLY_LIMIT - getTotalConsumption();
    return (remaining / daysLeft).toFixed(2);
  };

  const getStatus = () => {
    const lastReading = readings[readings.length - 1];
    if (!lastReading) return 'normal';
    if (lastReading.consumption > DAILY_MAX) return 'alert';
    if (lastReading.consumption > DAILY_SAFE) return 'warning';
    return 'success';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Energy Consumption Tracker</h1>
        <button 
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => {
            if (notifications) {
              setNotifications(false);
            } else {
              requestNotificationPermission();
            }
          }}
        >
          {notifications ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
        </button>
      </div>

      <form onSubmit={addReading} className="flex gap-2">
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

      <div className={`p-4 rounded ${
        getStatus() === 'alert' ? 'bg-red-100' :
        getStatus() === 'warning' ? 'bg-yellow-100' :
        'bg-green-100'
      }`}>
        <div className="space-y-2">
          <p>Total consumption: {getTotalConsumption().toFixed(2)} kWh</p>
          <p>Remaining daily target: {getRemainingDaily()} kWh</p>
          <p>Days remaining: {30 - readings.length}</p>
        </div>
      </div>

      <div className="h-64">
        <LineChart width={600} height={250} data={readings}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="consumption" stroke="#2563eb" />
        </LineChart>
      </div>

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
    </div>
  );
}
