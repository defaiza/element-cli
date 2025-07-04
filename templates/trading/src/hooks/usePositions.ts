import { useState, useEffect } from 'react';
import { Position } from '../types';

export function usePositions() {
  const [positions, setPositions] = useState<Position[]>([
    {
      symbol: 'BTC/USD',
      side: 'long',
      size: 0.25,
      entryPrice: 44500,
      currentPrice: 45000,
      pnl: 125,
      pnlPercent: 1.12
    },
    {
      symbol: 'ETH/USD',
      side: 'short',
      size: 2.5,
      entryPrice: 3050,
      currentPrice: 3000,
      pnl: 125,
      pnlPercent: 1.64
    }
  ]);

  useEffect(() => {
    // Update positions with current prices
    const interval = setInterval(() => {
      setPositions(prev => prev.map(position => {
        const priceChange = (Math.random() * 0.002 - 0.001);
        const newPrice = position.currentPrice * (1 + priceChange);
        
        let pnl;
        if (position.side === 'long') {
          pnl = (newPrice - position.entryPrice) * position.size;
        } else {
          pnl = (position.entryPrice - newPrice) * position.size;
        }
        
        const pnlPercent = (pnl / (position.entryPrice * position.size)) * 100;
        
        return {
          ...position,
          currentPrice: newPrice,
          pnl,
          pnlPercent
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return positions;
}