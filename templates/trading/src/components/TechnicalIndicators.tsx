import React from 'react';
import { useTechnicalIndicators } from '../hooks/useTechnicalIndicators';
import '../styles/TechnicalIndicators.css';

interface TechnicalIndicatorsProps {
  symbol: string;
}

const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({ symbol }) => {
  const indicators = useTechnicalIndicators(symbol);

  const getSignalClass = (value: number) => {
    if (value > 70) return 'overbought';
    if (value < 30) return 'oversold';
    return 'neutral';
  };

  return (
    <div className="technical-indicators">
      <h3 className="section-title">Technical Indicators</h3>
      
      <div className="indicators-grid">
        <div className="indicator">
          <span className="indicator-name">RSI (14)</span>
          <span className={`indicator-value ${getSignalClass(indicators.rsi)}`}>
            {indicators.rsi.toFixed(2)}
          </span>
        </div>
        
        <div className="indicator">
          <span className="indicator-name">MACD</span>
          <span className={`indicator-value ${indicators.macdSignal > 0 ? 'bullish' : 'bearish'}`}>
            {indicators.macdSignal > 0 ? '↑' : '↓'} {Math.abs(indicators.macdSignal).toFixed(2)}
          </span>
        </div>
        
        <div className="indicator">
          <span className="indicator-name">SMA (50)</span>
          <span className="indicator-value">
            ${indicators.sma50.toFixed(2)}
          </span>
        </div>
        
        <div className="indicator">
          <span className="indicator-name">EMA (20)</span>
          <span className="indicator-value">
            ${indicators.ema20.toFixed(2)}
          </span>
        </div>
        
        <div className="indicator">
          <span className="indicator-name">Volume</span>
          <span className={`indicator-value ${indicators.volumeTrend > 0 ? 'increasing' : 'decreasing'}`}>
            {indicators.volumeTrend > 0 ? '↑' : '↓'} {Math.abs(indicators.volumeTrend).toFixed(1)}%
          </span>
        </div>
        
        <div className="indicator">
          <span className="indicator-name">BB Width</span>
          <span className="indicator-value">
            {indicators.bollingerBandWidth.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default TechnicalIndicators;