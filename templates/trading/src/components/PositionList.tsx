import React from 'react';
import { usePositions } from '../hooks/usePositions';
import '../styles/PositionList.css';

const PositionList: React.FC = () => {
  const positions = usePositions();

  return (
    <div className="position-list">
      <h3 className="section-title">Open Positions</h3>
      
      {positions.length === 0 ? (
        <div className="no-positions">No open positions</div>
      ) : (
        <div className="positions">
          {positions.map((position, index) => (
            <div key={index} className="position-card">
              <div className="position-header">
                <span className="symbol">{position.symbol}</span>
                <span className={`side ${position.side}`}>
                  {position.side.toUpperCase()}
                </span>
              </div>
              
              <div className="position-details">
                <div className="detail-row">
                  <span className="label">Size:</span>
                  <span className="value">{position.size.toFixed(4)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Entry:</span>
                  <span className="value">${position.entryPrice.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Current:</span>
                  <span className="value">${position.currentPrice.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">P&L:</span>
                  <span className={`value ${position.pnl >= 0 ? 'profit' : 'loss'}`}>
                    ${position.pnl.toFixed(2)} ({position.pnlPercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
              
              <button className="close-position-btn">Close Position</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PositionList;