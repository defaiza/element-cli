import { useState, useEffect } from 'react';

interface TechnicalIndicators {
  rsi: number;
  macdSignal: number;
  sma50: number;
  ema20: number;
  volumeTrend: number;
  bollingerBandWidth: number;
}

export function useTechnicalIndicators(symbol: string) {
  const getBasePrice = () => {
    return symbol.includes('BTC') ? 45000 : 
           symbol.includes('ETH') ? 3000 : 
           symbol.includes('SOL') ? 150 : 3;
  };

  const [indicators, setIndicators] = useState<TechnicalIndicators>(() => {
    const basePrice = getBasePrice();
    return {
      rsi: 50,
      macdSignal: 0,
      sma50: basePrice,
      ema20: basePrice,
      volumeTrend: 0,
      bollingerBandWidth: 2.5
    };
  });

  useEffect(() => {
    // Simulate indicator updates
    const interval = setInterval(() => {
      setIndicators(prev => {
        const rsiChange = (Math.random() * 4 - 2);
        const newRsi = Math.max(0, Math.min(100, prev.rsi + rsiChange));
        
        const macdChange = (Math.random() * 0.4 - 0.2);
        const newMacd = prev.macdSignal + macdChange;
        
        const priceChange = Math.random() * 0.001 - 0.0005;
        const newSma = prev.sma50 * (1 + priceChange);
        const newEma = prev.ema20 * (1 + priceChange * 1.5);
        
        const volumeChange = (Math.random() * 10 - 5);
        const newVolumeTrend = Math.max(-100, Math.min(100, prev.volumeTrend + volumeChange));
        
        const bbChange = (Math.random() * 0.2 - 0.1);
        const newBBWidth = Math.max(0.5, Math.min(5, prev.bollingerBandWidth + bbChange));
        
        return {
          rsi: newRsi,
          macdSignal: newMacd,
          sma50: newSma,
          ema20: newEma,
          volumeTrend: newVolumeTrend,
          bollingerBandWidth: newBBWidth
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [symbol]);

  return indicators;
}