# DEFAI Chart Element Template

A comprehensive Chart.js React template for creating interactive data visualizations as DEFAI elements.

## Features

- **Multiple Chart Types**: Line, Bar, Pie, Doughnut charts
- **Real-time Data**: Live updating charts with configurable intervals
- **Interactive Controls**: Regenerate data, pause/resume, change orientations
- **Responsive Design**: Charts adapt to container size
- **Theme Support**: Light and dark theme compatibility
- **TypeScript**: Full type safety

## Chart Components

### Line Chart
- Monthly revenue tracking
- Multiple datasets with smooth curves
- Currency formatting on Y-axis

### Bar Chart
- Weekly performance comparison
- Horizontal/vertical orientation toggle
- Multi-dataset support

### Pie Chart
- Market share visualization
- Percentage calculations in tooltips
- Dynamic color schemes

### Doughnut Chart
- Budget distribution display
- Customizable cutout percentage
- Legend positioning options

### Real-time Chart
- Live data streaming
- Configurable update intervals (500ms - 5s)
- Pause/resume functionality
- Automatic data point limiting

## Project Structure

```
src/
├── components/       # Chart components
├── hooks/           # Custom React hooks
├── utils/           # Data generation utilities
├── styles/          # CSS styles
├── types.ts         # TypeScript definitions
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

## Usage

### Mounting the Chart Element

```typescript
import { mountChart } from './dist/main.js';

const element = document.getElementById('chart-container');
const chartInstance = mountChart(element, {
  title: 'My Dashboard',
  theme: 'dark',
  refreshInterval: 2000
});

// Update configuration
chartInstance.updateConfig({
  theme: 'light'
});

// Unmount when done
chartInstance.unmount();
```

### Configuration Options

```typescript
interface ChartConfig {
  title?: string;          // Element title
  apiEndpoint?: string;    // API for data fetching
  refreshInterval?: number; // Update interval in ms
  theme?: 'light' | 'dark'; // Visual theme
}
```

## Customization

### Adding New Chart Types

1. Create a new component in `src/components/`
2. Import the appropriate chart type from `react-chartjs-2`
3. Configure options and data structure
4. Add to App.tsx

### Custom Data Sources

Replace the data generator with API calls:

```typescript
const fetchData = async () => {
  const response = await fetch(config.apiEndpoint);
  const data = await response.json();
  setChartData(formatDataForChart(data));
};
```

## Building for DEFAI

The build creates a UMD bundle that can be deployed as a DEFAI element. External React dependencies are excluded in production builds to reduce bundle size.