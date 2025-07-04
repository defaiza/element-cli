import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { generateRandomData } from '../utils/dataGenerator';

const PieChartDemo: React.FC = () => {
  const [data, setData] = useState<ChartData<'pie'>>(generateRandomData('pie', 5));

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Market Share',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => (a as number) + (b as number), 0) as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${percentage}%`;
          }
        }
      }
    }
  };

  const regenerateData = () => {
    setData(generateRandomData('pie', 5));
  };

  return (
    <div>
      <div className="controls">
        <button onClick={regenerateData}>Regenerate Data</button>
      </div>
      <div className="chart-container">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChartDemo;