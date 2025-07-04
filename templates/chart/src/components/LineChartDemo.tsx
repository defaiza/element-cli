import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { generateRandomData } from '../utils/dataGenerator';

const LineChartDemo: React.FC = () => {
  const [data, setData] = useState<ChartData<'line'>>(generateRandomData('line', 12));

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Revenue',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const regenerateData = () => {
    setData(generateRandomData('line', 12));
  };

  return (
    <div>
      <div className="controls">
        <button onClick={regenerateData}>Regenerate Data</button>
      </div>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChartDemo;