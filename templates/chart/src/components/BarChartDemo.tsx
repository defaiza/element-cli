import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { generateRandomData } from '../utils/dataGenerator';

const BarChartDemo: React.FC = () => {
  const [data, setData] = useState<ChartData<'bar'>>(generateRandomData('bar', 7));
  const [horizontal, setHorizontal] = useState(false);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Performance',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      }
    }
  };

  const regenerateData = () => {
    setData(generateRandomData('bar', 7));
  };

  return (
    <div>
      <div className="controls">
        <button onClick={regenerateData}>Regenerate Data</button>
        <button onClick={() => setHorizontal(!horizontal)}>
          {horizontal ? 'Vertical' : 'Horizontal'}
        </button>
      </div>
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChartDemo;