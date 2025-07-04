import React, { useState } from 'react';
import '../styles/OrderForm.css';

interface OrderFormProps {
  symbol: string;
}

const OrderForm: React.FC<OrderFormProps> = ({ symbol }) => {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('limit');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState('0.00');

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (price && value) {
      setTotal((parseFloat(price) * parseFloat(value)).toFixed(2));
    }
  };

  const handlePriceChange = (value: string) => {
    setPrice(value);
    if (amount && value) {
      setTotal((parseFloat(value) * parseFloat(amount)).toFixed(2));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order submitted:', { orderType, side, price, amount, total });
    // Reset form
    setPrice('');
    setAmount('');
    setTotal('0.00');
  };

  return (
    <div className="order-form">
      <h3 className="section-title">Place Order</h3>
      
      <div className="order-type-tabs">
        <button 
          className={`tab ${orderType === 'limit' ? 'active' : ''}`}
          onClick={() => setOrderType('limit')}
        >
          Limit
        </button>
        <button 
          className={`tab ${orderType === 'market' ? 'active' : ''}`}
          onClick={() => setOrderType('market')}
        >
          Market
        </button>
      </div>

      <div className="side-selector">
        <button 
          className={`side-btn buy ${side === 'buy' ? 'active' : ''}`}
          onClick={() => setSide('buy')}
        >
          Buy
        </button>
        <button 
          className={`side-btn sell ${side === 'sell' ? 'active' : ''}`}
          onClick={() => setSide('sell')}
        >
          Sell
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {orderType === 'limit' && (
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              required
            />
            <span className="suffix">USD</span>
          </div>
        )}

        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            step="0.0001"
            placeholder="0.0000"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            required
          />
          <span className="suffix">{symbol.split('/')[0]}</span>
        </div>

        <div className="form-group">
          <label>Total</label>
          <input
            type="text"
            value={total}
            readOnly
            disabled
          />
          <span className="suffix">USD</span>
        </div>

        <button 
          type="submit" 
          className={`submit-btn ${side}`}
        >
          {side === 'buy' ? 'Buy' : 'Sell'} {symbol.split('/')[0]}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;