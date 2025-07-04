import React from 'react';
import { useTradeHistory } from '../hooks/useTradeHistory';
import '../styles/TradeHistory.css';

interface TradeHistoryProps {
  symbol: string;
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ symbol }) => {
  const trades = useTradeHistory(symbol);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="trade-history">
      <h3 className="section-title">Recent Trades</h3>
      
      <div className="trades-header">
        <span>Time</span>
        <span>Price</span>
        <span>Amount</span>
      </div>
      
      <div className="trades-list">
        {trades.map((trade) => (
          <div key={trade.id} className={`trade-row ${trade.side}`}>
            <span className="time">{formatTime(trade.time)}</span>
            <span className="price">${trade.price.toFixed(2)}</span>
            <span className="amount">{trade.amount.toFixed(4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeHistory;