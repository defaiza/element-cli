# DEFAI Trading Element Template

Advanced trading UI template for creating professional trading interfaces as DEFAI elements.

## Features

### Core Components

- **Candlestick Chart**: Interactive price charts with volume indicators using lightweight-charts
- **Order Book**: Real-time bid/ask visualization with depth display
- **Price Ticker**: Live price updates with 24h statistics
- **Trade History**: Recent trades with buy/sell indicators
- **Order Form**: Market and limit order placement interface
- **Position Manager**: Track open positions with P&L calculations
- **Technical Indicators**: RSI, MACD, SMA, EMA, and more

### UI Features

- Dark/Light theme support
- Responsive grid layout
- Real-time data updates
- Interactive controls
- Professional trading terminal design

## Project Structure

```
src/
├── components/       # Trading UI components
├── hooks/           # Custom React hooks for data
├── styles/          # Component-specific CSS
├── types/           # TypeScript interfaces
├── App.tsx          # Main application
└── index.tsx        # Entry point
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck
```

## Component Details

### CandlestickChart
- Candlestick and volume visualization
- Multiple timeframe support
- Zoom and pan functionality
- Crosshair for precise reading

### OrderBook
- Real-time bid/ask updates
- Depth visualization
- Spread calculation
- Order aggregation

### TechnicalIndicators
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- Moving Averages (SMA, EMA)
- Bollinger Bands
- Volume analysis

## Configuration

```typescript
interface TradingConfig {
  symbol?: string;          // Trading pair
  wsEndpoint?: string;      // WebSocket endpoint
  apiEndpoint?: string;     // REST API endpoint
  theme?: 'dark' | 'light'; // UI theme
}
```

## Customization

### Adding New Indicators

1. Create indicator calculation in hooks
2. Add display component
3. Update TechnicalIndicators component

### Connecting to Real APIs

Replace demo data generators in hooks with actual API calls:

```typescript
// In hooks/useTicker.ts
const response = await fetch(`${config.apiEndpoint}/ticker/${symbol}`);
const data = await response.json();
```

### WebSocket Integration

```typescript
const ws = new WebSocket(config.wsEndpoint);
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update state with real-time data
};
```

## Styling

The template uses CSS modules with support for both dark and light themes. All colors and styles follow a professional trading terminal aesthetic.

## Performance

- Optimized re-renders with React hooks
- Efficient chart updates
- Throttled WebSocket handlers
- Memoized calculations

## Building for DEFAI

The build creates a UMD bundle ready for deployment as a DEFAI element with external React dependencies in production.