# DEFAI Element CLI

Command-line interface for developing and publishing DEFAI elements.

## Installation

```bash
npm install -g @defai/element-cli
```

## Quick Start

Create a new element:

```bash
defai-element create my-element
cd my-element
defai-element dev
```

## Commands

### `create <name>`

Create a new element project.

```bash
defai-element create my-element --template react
```

Options:
- `-t, --template <template>` - Template to use (react, vue, vanilla, game, chart, trading)
- `-d, --directory <dir>` - Directory to create the element in
- `--typescript` - Use TypeScript (default)
- `--javascript` - Use JavaScript

### `dev`

Start the development server with hot reload.

```bash
defai-element dev
```

Options:
- `-p, --port <port>` - Port to run on (default: 3000)
- `-h, --host <host>` - Host to bind to (default: localhost)
- `--no-hot` - Disable hot reload
- `--open` - Open browser automatically

### `build`

Build the element for production.

```bash
defai-element build
```

Options:
- `-o, --output <dir>` - Output directory (default: dist)
- `--analyze` - Analyze bundle size
- `--source-maps` - Generate source maps
- `--no-minify` - Skip minification

### `validate`

Validate element code and configuration.

```bash
defai-element validate
```

Options:
- `--fix` - Automatically fix issues when possible
- `--strict` - Enable strict validation mode
- `--security-only` - Run only security checks

### `publish`

Publish element to the DEFAI marketplace.

```bash
defai-element publish
```

Options:
- `--tier <tier>` - Required user tier (free, bronze, silver, gold, titanium)
- `--price <price>` - Price in DEFAI tokens
- `--royalty <percentage>` - Royalty percentage (0-20)
- `--dry-run` - Simulate publish without uploading
- `--skip-validation` - Skip validation checks

### `login`

Login to your DEFAI developer account.

```bash
defai-element login
```

### `stats`

View statistics for your elements.

```bash
defai-element stats [elementId]
```

Options:
- `--period <period>` - Time period (day, week, month, year)
- `--format <format>` - Output format (table, json, csv)

### `list`

List your published elements.

```bash
defai-element list
```

Options:
- `--all` - Show all elements including unpublished
- `--sort <field>` - Sort by field (name, downloads, revenue)

### `test`

Run element tests.

```bash
defai-element test
```

Options:
- `--watch` - Run tests in watch mode
- `--coverage` - Generate coverage report
- `--e2e` - Run end-to-end tests

### `config`

Manage CLI configuration.

```bash
defai-element config --set apiKey=YOUR_API_KEY
defai-element config --get apiKey
defai-element config --list
defai-element config --reset
```

## Element Structure

```
my-element/
├── manifest.json      # Element metadata
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript config
├── webpack.config.js  # Build configuration
├── src/
│   ├── index.tsx     # Main element component
│   └── styles.css    # Element styles
├── public/
│   └── index.html    # HTML template
└── dist/             # Build output
```

## manifest.json

The manifest file defines your element's metadata and configuration:

```json
{
  "id": "my-element",
  "name": "My Element",
  "version": "1.0.0",
  "description": "Description of your element",
  "author": "Your Name",
  "category": "Utilities",
  "tierRequired": "free",
  "price": 0,
  "defaultSize": {
    "width": 400,
    "height": 300
  },
  "minSize": {
    "width": 200,
    "height": 150
  },
  "maxSize": {
    "width": 800,
    "height": 600
  },
  "permissions": {
    "wallet": false,
    "network": false,
    "storage": false,
    "notifications": false
  }
}
```

## DEFAI Element API

Elements have access to the DEFAI platform APIs:

```typescript
interface DefaiElementAPI {
  wallet: WalletAPI;
  storage: StorageAPI;
  notifications: NotificationAPI;
  theme: 'light' | 'dark';
  size: { width: number; height: number };
  onThemeChange(callback: (theme: string) => void): void;
  onSizeChange(callback: (size: Size) => void): void;
}
```

## Configuration

The CLI can be configured using:

1. Configuration file: `~/.defai/config.json`
2. Environment variables: `DEFAI_API_KEY`, `DEFAI_API_URL`
3. Config files: `.defai-elementrc`, `.defai-elementrc.json`, `.defai-elementrc.js`

## Development

### Prerequisites

- Node.js >= 16.0.0
- npm or yarn

### Building from Source

```bash
git clone https://github.com/defai/element-cli
cd element-cli
npm install
npm run build
npm link
```

### Running Tests

```bash
npm test
```

## License

MIT

## Support

- Documentation: https://docs.defai.com/elements
- Discord: https://discord.gg/defai
- GitHub Issues: https://github.com/defai/element-cli/issues 