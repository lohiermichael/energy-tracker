import React, { useMemo } from 'react';
import type { ProcessedReading } from '@/components/types';
import { CalendarClock } from 'lucide-react';

interface MonthlyTabsProps {
  readings: ProcessedReading[];
  activePeriod: string;
  onPeriodChange: (period: string) => void;
}

export default function MonthlyTabs({ 
  readings, 
  activePeriod, 
  onPeriodChange 
}: MonthlyTabsProps) {
  const periods = useMemo(() => {
    const uniquePeriods = new Map<string, ProcessedReading[]>();
    
    readings.forEach(reading => {
      const [day, month, year] = reading.date.split('/').map(Number);
      let periodKey: string;
      
      if (day < 16) {
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        periodKey = `${prevMonth}/${prevYear}`;
      } else {
        periodKey = `${month}/${year}`;
      }
      
      const existing = uniquePeriods.get(periodKey) || [];
      uniquePeriods.set(periodKey, [...existing, reading]);
    });
    
    return new Map([...uniquePeriods.entries()].sort().reverse());
  }, [readings]);

  const getCurrentPeriodKey = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    if (day < 16) {
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      return `${prevMonth}/${prevYear}`;
    }
    return `${month}/${year}`;
  };

  const goToCurrent = () => {
    const currentPeriod = getCurrentPeriodKey();
    // Always allow switching to current period, even if no data exists yet
    onPeriodChange(currentPeriod);
  };

  const formatPeriodLabel = (period: string) => {
    const [month, year] = period.split('/');
    const date = new Date(Number(year), Number(month) - 1);
    const nextDate = new Date(date);
    nextDate.setMonth(nextDate.getMonth() + 1);
    
    return `${date.toLocaleString('default', { 
      month: 'short' 
    })}-${nextDate.toLocaleString('default', { 
      month: 'short'
    })} ${year}`;
  };

  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-2 overflow-x-auto items-center">
          <button
            onClick={goToCurrent}
            className={`
              px-3 py-2 text-sm font-medium flex items-center gap-1
              ${activePeriod === getCurrentPeriodKey()
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
              }
            `}
            title="Go to current month"
          >
            <CalendarClock size={16} />
            <span className="hidden sm:inline">Current</span>
          </button>
          <div className="h-4 w-px bg-gray-300"></div>
          {[...periods.keys()].map((period) => (
            <button
              key={period}
              onClick={() => onPeriodChange(period)}
              className={`
                whitespace-nowrap px-4 py-2 border-b-2 font-medium text-sm
                ${
                  activePeriod === period
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }
              `}
            >
              {formatPeriodLabel(period)}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
