import React from 'react';
import { useTicker } from '../hooks/useTicker';
import '../styles/PriceTicker.css';

interface PriceTickerProps {
  symbol: string;
}

const PriceTicker: React.FC<PriceTickerProps> = ({ symbol }) => {
  const ticker = useTicker(symbol);

  const priceChangeClass = ticker.priceChange >= 0 ? 'positive' : 'negative';

  return (
    <div className="price-ticker">
      <div className="ticker-row">
        <div className="ticker-item">
          <span className="label">Last Price</span>
          <span className={`value large ${priceChangeClass}`}>
            ${ticker.lastPrice.toFixed(2)}
          </span>
        </div>
        
        <div className="ticker-item">
          <span className="label">24h Change</span>
          <span className={`value ${priceChangeClass}`}>
            {ticker.priceChange >= 0 ? '+' : ''}{ticker.priceChange.toFixed(2)} ({ticker.priceChangePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
      
      <div className="ticker-row">
        <div className="ticker-item">
          <span className="label">24h High</span>
          <span className="value">${ticker.high24h.toFixed(2)}</span>
        </div>
        
        <div className="ticker-item">
          <span className="label">24h Low</span>
          <span className="value">${ticker.low24h.toFixed(2)}</span>
        </div>
        
        <div className="ticker-item">
          <span className="label">24h Volume</span>
          <span className="value">{(ticker.volume24h / 1000).toFixed(2)}K</span>
        </div>
      </div>
    </div>
  );
};

export default PriceTicker;