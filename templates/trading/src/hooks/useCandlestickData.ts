import { useState, useEffect } from 'react';
import { PriceData } from '../types';

export function useCandlestickData(symbol: string) {
  const [data, setData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Generate demo candlestick data
    const generateData = () => {
      const now = Date.now();
      const hourInMs = 60 * 60 * 1000;
      const dataPoints: PriceData[] = [];
      
      let lastClose = symbol.includes('BTC') ? 45000 : 
                      symbol.includes('ETH') ? 3000 : 
                      symbol.includes('SOL') ? 150 : 3;
      
      for (let i = 100; i >= 0; i--) {
        const time = Math.floor((now - i * hourInMs) / 1000);
        const volatility = 0.02;
        const trend = Math.random() > 0.5 ? 1 : -1;
        
        const open = lastClose;
        const change = (Math.random() * volatility * 2 - volatility) * open;
        const close = open + change * trend;
        const high = Math.max(open, close) + Math.random() * volatility * open * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * open * 0.5;
        const volume = Math.random() * 1000000 + 500000;
        
        dataPoints.push({ time, open, high, low, close, volume });
        lastClose = close;
      }
      
      return dataPoints;
    };

    // Simulate API delay
    setTimeout(() => {
      setData(generateData());
      setIsLoading(false);
    }, 500);

    // Update last candle every 5 seconds
    const interval = setInterval(() => {
      setData(prevData => {
        if (prevData.length === 0) return prevData;
        
        const newData = [...prevData];
        const lastCandle = newData[newData.length - 1];
        const newPrice = lastCandle.close * (1 + (Math.random() * 0.002 - 0.001));
        
        newData[newData.length - 1] = {
          ...lastCandle,
          close: newPrice,
          high: Math.max(lastCandle.high, newPrice),
          low: Math.min(lastCandle.low, newPrice),
          volume: lastCandle.volume + Math.random() * 10000
        };
        
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [symbol]);

  return { data, isLoading };
}