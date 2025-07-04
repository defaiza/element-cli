import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TradingConfig } from './types';

export function mountTradingUI(element: HTMLElement, config?: TradingConfig) {
  const root = ReactDOM.createRoot(element);
  root.render(
    <React.StrictMode>
      <App config={config} />
    </React.StrictMode>
  );

  return {
    unmount: () => root.unmount(),
    updateConfig: (newConfig: TradingConfig) => {
      root.render(
        <React.StrictMode>
          <App config={newConfig} />
        </React.StrictMode>
      );
    }
  };
}

// Auto-mount if root element exists
const rootElement = document.getElementById('root');
if (rootElement) {
  mountTradingUI(rootElement);
}