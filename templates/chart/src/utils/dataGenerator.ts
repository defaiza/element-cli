import { ChartData, ChartType } from 'chart.js';

const COLORS = [
  'rgba(255, 99, 132, 0.8)',
  'rgba(54, 162, 235, 0.8)',
  'rgba(255, 206, 86, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(153, 102, 255, 0.8)',
  'rgba(255, 159, 64, 0.8)',
  'rgba(199, 199, 199, 0.8)',
  'rgba(83, 102, 255, 0.8)',
];

const BORDER_COLORS = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
  'rgba(199, 199, 199, 1)',
  'rgba(83, 102, 255, 1)',
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CATEGORIES = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'];
const DEPARTMENTS = ['Sales', 'Marketing', 'Development', 'Support'];

export function generateRandomData(type: ChartType, points: number): ChartData {
  switch (type) {
    case 'line':
      return generateLineData(points);
    case 'bar':
      return generateBarData(points);
    case 'pie':
    case 'doughnut':
      return generatePieData(points);
    default:
      return generateLineData(points);
  }
}

function generateLineData(points: number): ChartData<'line'> {
  const labels = MONTHS.slice(0, points);
  const datasets = [
    {
      label: 'Revenue',
      data: Array.from({ length: points }, () => Math.floor(Math.random() * 50000) + 10000),
      borderColor: BORDER_COLORS[0],
      backgroundColor: COLORS[0],
      tension: 0.1,
    },
    {
      label: 'Expenses',
      data: Array.from({ length: points }, () => Math.floor(Math.random() * 30000) + 5000),
      borderColor: BORDER_COLORS[1],
      backgroundColor: COLORS[1],
      tension: 0.1,
    },
  ];

  return { labels, datasets };
}

function generateBarData(points: number): ChartData<'bar'> {
  const labels = points === 7 ? DAYS : CATEGORIES.slice(0, points);
  const datasets = [
    {
      label: 'Current Period',
      data: Array.from({ length: points }, () => Math.floor(Math.random() * 100) + 20),
      backgroundColor: COLORS[2],
      borderColor: BORDER_COLORS[2],
      borderWidth: 1,
    },
    {
      label: 'Previous Period',
      data: Array.from({ length: points }, () => Math.floor(Math.random() * 100) + 20),
      backgroundColor: COLORS[3],
      borderColor: BORDER_COLORS[3],
      borderWidth: 1,
    },
  ];

  return { labels, datasets };
}

function generatePieData(points: number): ChartData<'pie' | 'doughnut'> {
  const labels = points === 4 ? DEPARTMENTS : CATEGORIES.slice(0, points);
  const data = Array.from({ length: points }, () => Math.floor(Math.random() * 100) + 20);
  
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: COLORS.slice(0, points),
        borderColor: BORDER_COLORS.slice(0, points),
        borderWidth: 2,
      },
    ],
  };
}

export function generateRealtimePoint(): number {
  return Math.floor(Math.random() * 50) + 25;
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}