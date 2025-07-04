import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { generateRandomData } from '../utils/dataGenerator';

const DoughnutChartDemo: React.FC = () => {
  const [data, setData] = useState<ChartData<'doughnut'>>(generateRandomData('doughnut', 4));

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Budget Distribution',
      },
    },
    cutout: '60%',
  };

  const regenerateData = () => {
    setData(generateRandomData('doughnut', 4));
  };

  return (
    <div>
      <div className="controls">
        <button onClick={regenerateData}>Regenerate Data</button>
      </div>
      <div className="chart-container">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default DoughnutChartDemo;