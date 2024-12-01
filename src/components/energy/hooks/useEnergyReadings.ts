"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Reading } from '../../types';

interface FirebaseReading extends Reading {
  id: string;
}

export function useEnergyReadings() {
  const [readings, setReadings] = useState<FirebaseReading[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const readingsQuery = query(
      collection(db, 'readings'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(readingsQuery, 
      (snapshot) => {
        const fetchedReadings: FirebaseReading[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedReadings.push({
            id: doc.id,
            date: data.date,
            value: data.value,
          });
        });
        setReadings(fetchedReadings);
      },
      (error) => {
        console.error('Error fetching readings:', error);
        setError('Failed to fetch readings');
      }
    );

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

  return { readings, error, addReading };
}
