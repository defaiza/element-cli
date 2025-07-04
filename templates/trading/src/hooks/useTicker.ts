import { useState, useEffect } from 'react';
import { Ticker } from '../types';

export function useTicker(symbol: string) {
  const getInitialPrice = () => {
    return symbol.includes('BTC') ? 45000 : 
           symbol.includes('ETH') ? 3000 : 
           symbol.includes('SOL') ? 150 : 3;
  };

  const [ticker, setTicker] = useState<Ticker>(() => {
    const basePrice = getInitialPrice();
    return {
      symbol,
      lastPrice: basePrice,
      priceChange: basePrice * 0.02,
      priceChangePercent: 2,
      high24h: basePrice * 1.05,
      low24h: basePrice * 0.95,
      volume24h: 1500000,
      quoteVolume24h: basePrice * 1500000
    };
  });

  useEffect(() => {
    // Update ticker every second
    const interval = setInterval(() => {
      setTicker(prev => {
        const change = (Math.random() * 0.002 - 0.001);
        const newPrice = prev.lastPrice * (1 + change);
        const priceChange = newPrice - (prev.lastPrice - prev.priceChange);
        
        return {
          ...prev,
          lastPrice: newPrice,
          priceChange: priceChange,
          priceChangePercent: (priceChange / (prev.lastPrice - prev.priceChange)) * 100,
          high24h: Math.max(prev.high24h, newPrice),
          low24h: Math.min(prev.low24h, newPrice),
          volume24h: prev.volume24h + Math.random() * 1000,
          quoteVolume24h: prev.quoteVolume24h + (newPrice * Math.random() * 1000)
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [symbol]);

  return ticker;
}