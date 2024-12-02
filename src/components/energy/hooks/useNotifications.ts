import { useState, useEffect } from 'react';
import { DAILY_SAFE } from '../constants';
import { ProcessedReading } from '../../types';

export function useNotifications(readings: ProcessedReading[]) {
  const [notifications, setNotifications] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('energyNotifications');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('energyNotifications', JSON.stringify(notifications));

    if (notifications && readings.length > 0) {
      const lastReading = readings[readings.length - 1];
      
      if (lastReading.consumption > DAILY_SAFE) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Energy Alert', {
            body: `Daily consumption (${lastReading.consumption.toFixed(2)} kWh) ` +
                  `above safe target (${DAILY_SAFE} kWh)`,
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

  return { notifications, setNotifications, requestNotificationPermission };
}
