import { useState, useEffect } from 'react';
import { Trade } from '../types';

export function useTradeHistory(symbol: string) {
  const [trades, setTrades] = useState<Trade[]>([]);

  const generateTrade = (basePrice: number): Trade => {
    const side = Math.random() > 0.5 ? 'buy' : 'sell';
    const priceVariation = (Math.random() * 0.002 - 0.001) * basePrice;
    const price = basePrice + priceVariation;
    const amount = Math.random() * 2 + 0.01;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      time: Date.now(),
      price,
      amount,
      side
    };
  };

  useEffect(() => {
    const basePrice = symbol.includes('BTC') ? 45000 : 
                     symbol.includes('ETH') ? 3000 : 
                     symbol.includes('SOL') ? 150 : 3;
    
    // Generate initial trades
    const initialTrades: Trade[] = [];
    for (let i = 0; i < 20; i++) {
      const trade = generateTrade(basePrice);
      trade.time = Date.now() - (20 - i) * 1000;
      initialTrades.push(trade);
    }
    setTrades(initialTrades);

    // Add new trades periodically
    const interval = setInterval(() => {
      setTrades(prev => {
        const lastPrice = prev[0]?.price || basePrice;
        const newTrade = generateTrade(lastPrice);
        return [newTrade, ...prev].slice(0, 50);
      });
    }, Math.random() * 2000 + 1000);

    return () => clearInterval(interval);
  }, [symbol]);

  return trades;
}