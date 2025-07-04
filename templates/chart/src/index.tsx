import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChartConfig } from './types';

export function mountChart(element: HTMLElement, config?: ChartConfig) {
  const root = ReactDOM.createRoot(element);
  root.render(
    <React.StrictMode>
      <App config={config} />
    </React.StrictMode>
  );

  return {
    unmount: () => root.unmount(),
    updateConfig: (newConfig: ChartConfig) => {
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
  mountChart(rootElement);
}