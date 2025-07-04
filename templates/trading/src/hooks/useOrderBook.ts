import { useState, useEffect } from 'react';
import { OrderBook } from '../types';

export function useOrderBook(symbol: string) {
  const [orderBook, setOrderBook] = useState<OrderBook>({
    bids: [],
    asks: [],
    lastUpdate: Date.now()
  });

  const generateOrderBook = (basePrice: number): OrderBook => {
    const bids = [];
    const asks = [];
    
    let bidTotal = 0;
    let askTotal = 0;
    
    // Generate bids
    for (let i = 0; i < 20; i++) {
      const price = basePrice - (i + 1) * 0.5;
      const amount = Math.random() * 2 + 0.1;
      bidTotal += price * amount;
      bids.push({ price, amount, total: bidTotal });
    }
    
    // Generate asks
    for (let i = 0; i < 20; i++) {
      const price = basePrice + (i + 1) * 0.5;
      const amount = Math.random() * 2 + 0.1;
      askTotal += price * amount;
      asks.push({ price, amount, total: askTotal });
    }
    
    return {
      bids,
      asks,
      lastUpdate: Date.now()
    };
  };

  useEffect(() => {
    const basePrice = symbol.includes('BTC') ? 45000 : 
                     symbol.includes('ETH') ? 3000 : 
                     symbol.includes('SOL') ? 150 : 3;
    
    setOrderBook(generateOrderBook(basePrice));

    // Update order book every 2 seconds
    const interval = setInterval(() => {
      const currentBase = orderBook.bids[0]?.price || basePrice;
      const newBase = currentBase * (1 + (Math.random() * 0.001 - 0.0005));
      setOrderBook(generateOrderBook(newBase));
    }, 2000);

    return () => clearInterval(interval);
  }, [symbol]);

  const spread = orderBook.asks[0]?.price - orderBook.bids[0]?.price || 0;
  const spreadPercent = orderBook.bids[0]?.price 
    ? (spread / orderBook.bids[0].price) * 100 
    : 0;

  return { orderBook, spread, spreadPercent };
}