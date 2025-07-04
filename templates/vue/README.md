# DEFAI Vue Element Template

This is a Vue 3 template for creating DEFAI elements with TypeScript support.

## Features

- Vue 3 with Composition API
- TypeScript support
- Vite for fast development and building
- Example components demonstrating:
  - State management with ref
  - API data fetching
  - Custom composables
  - Mouse tracking
  - Local storage integration

## Project Structure

```
src/
├── components/         # Vue components
├── composables/       # Reusable composition functions
├── types/            # TypeScript type definitions
├── App.vue           # Root component
└── main.ts           # Entry point
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

## Creating Custom Elements

1. Add your components in `src/components/`
2. Create composables for reusable logic in `src/composables/`
3. Define types in `src/types/`
4. Update `App.vue` to include your components

## Configuration

The element accepts a configuration object:

```typescript
interface DEFAIConfig {
  title?: string
  description?: string
  apiEndpoint?: string
  theme?: 'light' | 'dark'
  [key: string]: any
}
```

## Building for DEFAI

When built, this creates a library that can be deployed as a DEFAI element. The build output will be in the `dist` directory.