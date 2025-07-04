import React from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { ChartConfig } from './types';
import LineChartDemo from './components/LineChartDemo';
import BarChartDemo from './components/BarChartDemo';
import PieChartDemo from './components/PieChartDemo';
import DoughnutChartDemo from './components/DoughnutChartDemo';
import RealtimeChart from './components/RealtimeChart';
import './styles/App.css';

// Register Chart.js components
ChartJS.register(...registerables);

interface AppProps {
  config?: ChartConfig;
}

const App: React.FC<AppProps> = ({ config }) => {
  const title = config?.title || 'DEFAI Chart Element';
  const theme = config?.theme || 'light';

  return (
    <div className={`app ${theme}`}>
      <div className="container">
        <h1>{title}</h1>
        <p className="subtitle">Interactive data visualization with Chart.js and React</p>

        <div className="chart-grid">
          <div className="chart-card">
            <h2>Line Chart</h2>
            <LineChartDemo />
          </div>

          <div className="chart-card">
            <h2>Bar Chart</h2>
            <BarChartDemo />
          </div>

          <div className="chart-card">
            <h2>Pie Chart</h2>
            <PieChartDemo />
          </div>

          <div className="chart-card">
            <h2>Doughnut Chart</h2>
            <DoughnutChartDemo />
          </div>

          <div className="chart-card full-width">
            <h2>Real-time Data</h2>
            <RealtimeChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;