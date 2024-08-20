import React, { useRef, useCallback, useEffect } from 'react';
import {
  format,
  isValid,
  differenceInDays,
  parseISO,
  addDays,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { debounce } from 'lodash';
import './timeLine.css';

type TimelineProps = {
  startDate: Date;
  endDate: Date;
  progressDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  setProgressDate: (date: Date) => void;
};

export default function Timeline({
  startDate,
  endDate,
  progressDate,
  setStartDate,
  setEndDate,
  setProgressDate,
}: TimelineProps) {
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isValid(startDate) || !isValid(endDate) || !isValid(progressDate)) {
      return;
    }

    if (startDate > endDate) {
      return;
    }

    if (progressDate < startDate || progressDate > endDate) {
      return;
    }
  }, [startDate, endDate, progressDate]);

  const calculateProgress = useCallback(() => {
    const totalDays = differenceInDays(endDate, startDate);
    const progressDays = differenceInDays(progressDate, startDate);
    return totalDays === 0
      ? 0
      : Math.min(Math.max((progressDays / totalDays) * 100, 0), 100);
  }, [startDate, endDate, progressDate]);

  const getDateFromProgress = useCallback(
    (progressValue: number) => {
      const totalDays = differenceInDays(endDate, startDate);
      const progressDays = Math.round(totalDays * (progressValue / 100));
      return addDays(startDate, progressDays);
    },
    [startDate, endDate]
  );

  const debouncedSetProgressDate = useRef(
    debounce((date: Date) => {
      setProgressDate(date);
    }, 100)
  ).current;

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value);
    if (!isNaN(newProgress)) {
      const newProgressDate = getDateFromProgress(newProgress);
      debouncedSetProgressDate(newProgressDate);
    }
  };

  const handleDateClick = (inputRef: React.RefObject<HTMLInputElement>) => {
    inputRef.current?.showPicker();
  };

  const handleDateChange = (
    dateType: 'start' | 'end' | 'progress',
    value: string
  ) => {
    let date = parseISO(value);
    if (isValid(date)) {
      if (dateType === 'start') {
        // Asegurar que el inicio sea a las 00:00:00
        date = setHours(
          setMinutes(setSeconds(setMilliseconds(date, 0), 0), 0),
          0
        );

        const newStartDate = date > endDate ? endDate : date;
        setStartDate(newStartDate);

        if (progressDate < newStartDate) {
          setProgressDate(newStartDate);
        }
      } else if (dateType === 'end') {
        // Asegurar que el fin sea a las 23:59:59
        date = setHours(
          setMinutes(setSeconds(setMilliseconds(date, 999), 59), 59),
          23
        );

        const newEndDate = date < startDate ? startDate : date;
        setEndDate(newEndDate);

        if (progressDate > newEndDate) {
          setProgressDate(newEndDate);
        }
      } else if (dateType === 'progress') {
        if (date < startDate) {
          setProgressDate(startDate);
        } else if (date > endDate) {
          setProgressDate(endDate);
        }
      }
    }
  };

  const progress = calculateProgress();

  return (
    <div className="relative">
      <div className="text-center text-sm font-semibold text-blue-600 mt-1">
        {format(progressDate, 'dd MMMM yyyy', { locale: es })}
      </div>
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden p-3">
        <div className="flex items-center justify-between">
          <input
            ref={startInputRef}
            type="date"
            value={format(startDate, 'yyyy-MM-dd')}
            onChange={(e) => handleDateChange('start', e.target.value)}
            className="inset-0 opacity-0 cursor-pointer w-1"
          />
          <button
            className="text-sm font-medium text-gray-700 cursor-pointer w-full px-4"
            onClick={() => handleDateClick(startInputRef)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleDateClick(startInputRef);
              }
            }}
          >
            {format(startDate, 'dd MMM yyyy', { locale: es })}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={isNaN(progress) ? 0 : progress}
            onChange={handleProgressChange}
            className="customRange w-3/5 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
          />
          <input
            ref={endInputRef}
            type="date"
            value={format(endDate, 'yyyy-MM-dd')}
            onChange={(e) => handleDateChange('end', e.target.value)}
            className="inset-0 opacity-0 cursor-pointer w-1"
          />
          <button
            className="text-sm font-medium text-gray-700 cursor-pointer w-full px-4"
            onClick={() => handleDateClick(endInputRef)}
          >
            {format(endDate, 'dd MMM yyyy', { locale: es })}
          </button>
        </div>
      </div>
    </div>
  );
}
