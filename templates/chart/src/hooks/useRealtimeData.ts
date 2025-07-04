import { useState, useEffect, useRef } from 'react';
import { ChartData } from 'chart.js';
import { generateRealtimePoint, formatTimestamp } from '../utils/dataGenerator';

const MAX_POINTS = 20;

export function useRealtimeData(interval: number, isPaused: boolean) {
  const [data, setData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [
      {
        label: 'Sensor 1',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Sensor 2',
        data: [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
      },
    ],
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const addDataPoint = () => {
    const timestamp = formatTimestamp(new Date());
    
    setData(prevData => {
      const newLabels = [...prevData.labels as string[], timestamp].slice(-MAX_POINTS);
      const newDatasets = prevData.datasets.map(dataset => ({
        ...dataset,
        data: [...dataset.data, generateRealtimePoint()].slice(-MAX_POINTS),
      }));

      return {
        labels: newLabels,
        datasets: newDatasets,
      };
    });
  };

  const reset = () => {
    setData({
      labels: [],
      datasets: [
        {
          label: 'Sensor 1',
          data: [],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
        },
        {
          label: 'Sensor 2',
          data: [],
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.1,
        },
      ],
    });
  };

  useEffect(() => {
    if (!isPaused) {
      // Add initial data point
      addDataPoint();
      
      // Set up interval
      intervalRef.current = setInterval(addDataPoint, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, isPaused]);

  return { data, reset };
}