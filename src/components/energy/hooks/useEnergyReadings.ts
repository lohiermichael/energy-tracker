import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Reading } from '../../types';

export function useEnergyReadings() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'readings'), orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const newReadings = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Reading[];
        setReadings(newReadings);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching readings:', error);
        setError('Failed to fetch readings. Please try again later.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addReading = async (value: number) => {
    try {
      const date = new Date();
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      
      await addDoc(collection(db, 'readings'), {
        date: formattedDate,
        value,
        timestamp: Timestamp.fromDate(date)
      });
    } catch (err) {
      console.error('Error adding reading:', err);
      setError('Failed to add reading. Please try again.');
    }
  };

  return { readings, error, isLoading, addReading };
}
