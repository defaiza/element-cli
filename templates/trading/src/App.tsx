import React, { useState } from 'react';
import { TradingConfig } from './types';
import CandlestickChart from './components/CandlestickChart';
import OrderBook from './components/OrderBook';
import PriceTicker from './components/PriceTicker';
import TradeHistory from './components/TradeHistory';
import OrderForm from './components/OrderForm';
import PositionList from './components/PositionList';
import TechnicalIndicators from './components/TechnicalIndicators';
import './styles/App.css';

interface AppProps {
  config?: TradingConfig;
}

const App: React.FC<AppProps> = ({ config }) => {
  const [selectedSymbol, setSelectedSymbol] = useState(config?.symbol || 'BTC/USD');
  const theme = config?.theme || 'dark';

  return (
    <div className={`trading-app ${theme}`}>
      <div className="header">
        <h1>DEFAI Trading Terminal</h1>
        <div className="symbol-selector">
          <select 
            value={selectedSymbol} 
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="symbol-dropdown"
          >
            <option value="BTC/USD">BTC/USD</option>
            <option value="ETH/USD">ETH/USD</option>
            <option value="SOL/USD">SOL/USD</option>
            <option value="MATIC/USD">MATIC/USD</option>
          </select>
        </div>
      </div>

      <div className="trading-layout">
        <div className="left-panel">
          <div className="price-ticker-section">
            <PriceTicker symbol={selectedSymbol} />
          </div>
          
          <div className="chart-section">
            <CandlestickChart symbol={selectedSymbol} />
          </div>
          
          <div className="indicators-section">
            <TechnicalIndicators symbol={selectedSymbol} />
          </div>
        </div>

        <div className="middle-panel">
          <div className="orderbook-section">
            <OrderBook symbol={selectedSymbol} />
          </div>
          
          <div className="trades-section">
            <TradeHistory symbol={selectedSymbol} />
          </div>
        </div>

        <div className="right-panel">
          <div className="order-form-section">
            <OrderForm symbol={selectedSymbol} />
          </div>
          
          <div className="positions-section">
            <PositionList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;