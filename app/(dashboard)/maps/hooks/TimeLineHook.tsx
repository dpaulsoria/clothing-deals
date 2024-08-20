import { useState } from 'react';
import {
  subMonths,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from 'date-fns';

export function useTimeLine() {
  const initialStartDate = setHours(
    setMinutes(setSeconds(setMilliseconds(subMonths(new Date(), 1), 0), 0), 0),
    0
  );

  // Configurar endDate al final del día (23:59:59:999)
  const initialEndDate = setHours(
    setMinutes(setSeconds(setMilliseconds(new Date(), 999), 59), 59),
    23
  );

  const [startDate, setStartDate] = useState(initialStartDate);
  const [progressDate, setProgressDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  return {
    startDate,
    endDate,
    progressDate,
    setStartDate: (date: Date) => {
      const adjustedStartDate = setHours(
        setMinutes(setSeconds(setMilliseconds(date, 0), 0), 0),
        0
      );
      setStartDate(adjustedStartDate);
    },
    setEndDate: (date: Date) => {
      const adjustedEndDate = setHours(
        setMinutes(setSeconds(setMilliseconds(date, 999), 59), 59),
        23
      );
      setEndDate(adjustedEndDate);
    },
    setProgressDate,
  };
}
