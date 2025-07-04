import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { useCandlestickData } from '../hooks/useCandlestickData';
import '../styles/CandlestickChart.css';

interface CandlestickChartProps {
  symbol: string;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ symbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  
  const { data, isLoading } = useCandlestickData(symbol);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: 'transparent' },
        textColor: '#e6edf3',
      },
      grid: {
        vertLines: { color: '#30363d' },
        horzLines: { color: '#30363d' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#30363d',
      },
      timeScale: {
        borderColor: '#30363d',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a641',
      downColor: '#f85149',
      borderUpColor: '#26a641',
      borderDownColor: '#f85149',
      wickUpColor: '#26a641',
      wickDownColor: '#f85149',
    });

    const volumeSeries = chart.addHistogramSeries({
      color: '#26d0ce',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!candlestickSeriesRef.current || !volumeSeriesRef.current || !data) return;

    const candleData: CandlestickData[] = data.map(d => ({
      time: d.time as any,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    const volumeData = data.map(d => ({
      time: d.time as any,
      value: d.volume,
      color: d.close >= d.open ? '#26a64133' : '#f8514933',
    }));

    candlestickSeriesRef.current.setData(candleData);
    volumeSeriesRef.current.setData(volumeData);
    
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [data]);

  return (
    <div className="candlestick-chart">
      <h3 className="section-title">Price Chart</h3>
      {isLoading && <div className="loading">Loading chart data...</div>}
      <div ref={chartContainerRef} className="chart-container" />
      <div className="chart-controls">
        <button className="timeframe-btn active">1H</button>
        <button className="timeframe-btn">4H</button>
        <button className="timeframe-btn">1D</button>
        <button className="timeframe-btn">1W</button>
      </div>
    </div>
  );
};

export default CandlestickChart;