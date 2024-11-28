import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { readings } from '@/data/readings';

// Log the config to verify values are loaded (remove in production)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

console.log('Firebase Config:', firebaseConfig); // For debugging

if (!firebaseConfig.apiKey) {
  throw new Error('Firebase configuration is missing. Check your .env.local file');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateReadings() {
  try {
    const readingsCollection = collection(db, 'readings');
    
    // Sort readings by date to maintain order
    const sortedReadings = [...readings].sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    console.log(`Attempting to migrate ${sortedReadings.length} readings`);

    for (const reading of sortedReadings) {
      const date = parseDate(reading.date);
      
      const readingDoc = {
        date: reading.date,
        value: Number(reading.value),
        timestamp: Timestamp.fromDate(date)
      };

      console.log('Migrating document:', readingDoc); // For debugging

      await addDoc(readingsCollection, readingDoc);
      console.log(`Successfully migrated reading for date: ${reading.date}`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

// Helper function to parse UK date format (DD/MM/YYYY)
function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}

// Run the migration
migrateReadings();
