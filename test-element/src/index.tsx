import React, { useState, useEffect } from 'react';
import './styles.css';

interface ElementProps {
  theme?: 'light' | 'dark';
  size?: {
    width: number;
    height: number;
  };
}

const Element: React.FC<ElementProps> = ({ theme = 'dark', size }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Listen for theme changes from parent
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'theme') {
        // Handle theme change
        console.log('Theme changed to:', event.data.theme);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className={`element element-${theme}`} style={size}>
      <div className="element-header">
        <h2>Trader</h2>
        <p>Trading Element</p>
      </div>
      
      <div className="element-content">
        <div className="counter">
          <p>Count: {count}</p>
          <button onClick={() => setCount(count + 1)}>
            Increment
          </button>
          <button onClick={() => setCount(0)}>
            Reset
          </button>
        </div>
        
        <div className="info">
          <p><strong>Author:</strong> futjr</p>
          <p><strong>Category:</strong> Utilities</p>
          <p><strong>Tier:</strong> free</p>
        </div>
      </div>
    </div>
  );
};

export default Element; 