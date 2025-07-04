import React from 'react';
import { useOrderBook } from '../hooks/useOrderBook';
import '../styles/OrderBook.css';

interface OrderBookProps {
  symbol: string;
}

const OrderBook: React.FC<OrderBookProps> = ({ symbol }) => {
  const { orderBook, spread, spreadPercent } = useOrderBook(symbol);

  const maxAmount = Math.max(
    ...orderBook.asks.map(ask => ask.amount),
    ...orderBook.bids.map(bid => bid.amount)
  );

  return (
    <div className="order-book">
      <h3 className="section-title">Order Book</h3>
      
      <div className="order-book-header">
        <span>Price</span>
        <span>Amount</span>
        <span>Total</span>
      </div>

      <div className="asks">
        {orderBook.asks.slice(0, 10).reverse().map((ask, index) => (
          <div key={index} className="order-row ask">
            <div 
              className="order-bg" 
              style={{ width: `${(ask.amount / maxAmount) * 100}%` }}
            />
            <span className="price">{ask.price.toFixed(2)}</span>
            <span className="amount">{ask.amount.toFixed(4)}</span>
            <span className="total">{ask.total.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="spread">
        <span>Spread: {spread.toFixed(2)} ({spreadPercent.toFixed(2)}%)</span>
      </div>

      <div className="bids">
        {orderBook.bids.slice(0, 10).map((bid, index) => (
          <div key={index} className="order-row bid">
            <div 
              className="order-bg" 
              style={{ width: `${(bid.amount / maxAmount) * 100}%` }}
            />
            <span className="price">{bid.price.toFixed(2)}</span>
            <span className="amount">{bid.amount.toFixed(4)}</span>
            <span className="total">{bid.total.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;