"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Reading } from '../../types';

export function useEnergyReadings() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const readingsQuery = query(
      collection(db, 'readings'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(readingsQuery, 
      (snapshot) => {
        const fetchedReadings: Reading[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedReadings.push({
            date: data.date,
            value: data.value,
          });
        });
        setReadings(fetchedReadings);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching readings:', error);
        setError('Failed to fetch readings');
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const addReading = async (value: number) => {
    try {
      const newReading = {
        date: new Date().toLocaleDateString('en-GB'),
        value: value,
        timestamp: new Date()
      };

      await addDoc(collection(db, 'readings'), newReading);
    } catch (err) {
      setError('Failed to add reading');
      console.error('Error adding reading:', err);
    }
  };

  return { readings, loading, error, addReading };
}
