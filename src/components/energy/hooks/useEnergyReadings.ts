"use client";

import { useState, useEffect } from 'react';
import { readings as initialReadings } from '@/data/readings';
import { Reading } from '../../types';

export function useEnergyReadings() {
  const [readings, setReadings] = useState<Reading[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('energyReadings');
      return saved ? JSON.parse(saved) : initialReadings;
    }
    return initialReadings;
  });

  useEffect(() => {
    localStorage.setItem('energyReadings', JSON.stringify(readings));
  }, [readings]);

  return { readings, setReadings };
}
