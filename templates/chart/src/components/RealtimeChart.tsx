import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { useRealtimeData } from '../hooks/useRealtimeData';

const RealtimeChart: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [updateInterval, setUpdateInterval] = useState(1000);
  const { data, reset } = useRealtimeData(updateInterval, isPaused);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Real-time Data Stream',
      },
    },
    scales: {
      x: {
        type: 'category',
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        }
      },
      y: {
        beginAtZero: true,
        suggestedMax: 100,
      }
    }
  };

  return (
    <div>
      <div className="controls">
        <button onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={reset}>Reset</button>
        <select 
          value={updateInterval} 
          onChange={(e) => setUpdateInterval(Number(e.target.value))}
        >
          <option value={500}>500ms</option>
          <option value={1000}>1s</option>
          <option value={2000}>2s</option>
          <option value={5000}>5s</option>
        </select>
      </div>
      <div className="chart-container" style={{ height: '400px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default RealtimeChart;