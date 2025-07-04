import { ChartType, ChartData, ChartOptions } from 'chart.js';

export interface ChartConfig {
  title?: string;
  apiEndpoint?: string;
  refreshInterval?: number;
  theme?: 'light' | 'dark';
}

export interface DataPoint {
  label: string;
  value: number;
  timestamp?: Date;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface CustomChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartComponentProps {
  type: ChartType;
  data: ChartData;
  options?: ChartOptions;
  height?: number;
  width?: number;
}