"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.devCommand = devCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const webpack_1 = __importDefault(require("webpack"));
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const portfinder_1 = __importDefault(require("portfinder"));
const logger_1 = require("../utils/logger");
const webpack_config_1 = require("../config/webpack.config");
const validators_1 = require("../utils/validators");
const open_1 = __importDefault(require("open"));
const chokidar_1 = __importDefault(require("chokidar"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const logger = new logger_1.Logger();
async function devCommand(options) {
    const spinner = (0, ora_1.default)();
    try {
        // Validate project
        const projectDir = process.cwd();
        const validation = await (0, validators_1.validateProject)(projectDir);
        if (!validation.valid) {
            logger.error('Invalid element project:');
            validation.errors.forEach(err => logger.error(`  • ${err}`));
            process.exit(1);
        }
        // Find available port
        const basePort = parseInt(options.port);
        portfinder_1.default.basePort = basePort;
        const port = await portfinder_1.default.getPortPromise();
        if (port !== basePort) {
            logger.warn(`Port ${basePort} is in use, using port ${port} instead`);
        }
        // Load element manifest
        const manifestPath = path_1.default.join(projectDir, 'manifest.json');
        const manifest = fs_extra_1.default.readJsonSync(manifestPath);
        spinner.start('Starting development server...');
        // Get webpack configuration
        const webpackConfig = (0, webpack_config_1.getWebpackConfig)({
            mode: 'development',
            projectDir,
            hot: options.hot,
            port
        });
        // Create compiler
        const compiler = (0, webpack_1.default)(webpackConfig);
        // Webpack progress plugin
        compiler.hooks.compile.tap('DevServer', () => {
            spinner.text = 'Compiling...';
        });
        compiler.hooks.done.tap('DevServer', (stats) => {
            if (stats.hasErrors()) {
                spinner.fail('Compilation failed');
                console.error(stats.toString({ colors: true }));
            }
            else {
                spinner.succeed('Compiled successfully!');
                logger.info('\n' + chalk_1.default.bold('Element Development Server'));
                logger.info('─'.repeat(40));
                logger.info(`Element: ${chalk_1.default.cyan(manifest.name)}`);
                logger.info(`Version: ${chalk_1.default.cyan(manifest.version)}`);
                logger.info(`Category: ${chalk_1.default.cyan(manifest.category)}`);
                logger.info('─'.repeat(40));
                logger.info(`Local: ${chalk_1.default.cyan(`http://${options.host}:${port}`)}`);
                logger.info(`Preview: ${chalk_1.default.cyan(`http://${options.host}:${port}/preview`)}`);
                logger.info(`API Docs: ${chalk_1.default.cyan(`http://${options.host}:${port}/api-docs`)}`);
                logger.info('─'.repeat(40));
                logger.info('Use ' + chalk_1.default.cyan('Ctrl+C') + ' to stop the server\n');
            }
        });
        // Dev server configuration
        const devServerOptions = {
            host: options.host,
            port,
            hot: options.hot,
            open: false, // We'll handle this manually
            compress: true,
            historyApiFallback: true,
            static: {
                directory: path_1.default.join(projectDir, 'public'),
                publicPath: '/'
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
            },
            devMiddleware: {
                publicPath: '/'
            },
            setupMiddlewares: (middlewares, devServer) => {
                // Add custom routes
                const app = devServer.app;
                if (app) {
                    // Element preview route
                    app.get('/preview', (req, res) => {
                        res.send(generatePreviewHTML(manifest, port));
                    });
                    // API documentation route
                    app.get('/api-docs', (req, res) => {
                        res.send(generateAPIDocs());
                    });
                    // Element manifest endpoint
                    app.get('/manifest.json', (req, res) => {
                        res.json(manifest);
                    });
                    // Mock API endpoints for development
                    app.get('/api/wallet', (req, res) => {
                        res.json({
                            connected: true,
                            address: '8xY9ZQs4CtBTgZP3GYkWwBeGYDWkjPS7HpqQoqBon7NV',
                            balance: 1000
                        });
                    });
                    app.get('/api/prices/:symbol', (req, res) => {
                        const prices = {
                            SOL: 100.50,
                            DEFAI: 0.001234,
                            USDC: 1.00
                        };
                        res.json({
                            symbol: req.params.symbol,
                            price: prices[req.params.symbol] || 0
                        });
                    });
                }
                return middlewares;
            }
        };
        // Create and start dev server
        const server = new webpack_dev_server_1.default(devServerOptions, compiler);
        await server.start();
        // Open browser if requested
        if (options.open) {
            setTimeout(() => {
                (0, open_1.default)(`http://${options.host}:${port}/preview`);
            }, 1000);
        }
        // Watch for manifest changes
        const watcher = chokidar_1.default.watch(['manifest.json', 'src/**/*'], {
            cwd: projectDir,
            ignoreInitial: true
        });
        watcher.on('change', (file) => {
            logger.info(`File changed: ${file}`);
            if (file === 'manifest.json') {
                logger.info('Reloading manifest...');
                try {
                    const newManifest = fs_extra_1.default.readJsonSync(manifestPath);
                    Object.assign(manifest, newManifest);
                }
                catch (error) {
                    logger.error(`Failed to reload manifest: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
        });
        // Handle shutdown
        process.on('SIGINT', async () => {
            logger.info('\nShutting down development server...');
            watcher.close();
            await server.stop();
            process.exit(0);
        });
    }
    catch (error) {
        spinner.fail('Failed to start development server');
        logger.error(error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    }
}
function generatePreviewHTML(manifest, port) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${manifest.name} - Element Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0a0a;
      color: #ffffff;
      display: flex;
      height: 100vh;
    }
    .sidebar {
      width: 300px;
      background: #1a1a1a;
      padding: 20px;
      overflow-y: auto;
      border-right: 1px solid #333;
    }
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .header {
      background: #1a1a1a;
      padding: 20px;
      border-bottom: 1px solid #333;
    }
    .preview-container {
      flex: 1;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0f0f0f;
    }
    .element-frame {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
    .element-header {
      background: #252525;
      padding: 10px 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #333;
    }
    .element-content {
      background: #1a1a1a;
    }
    .info-item {
      margin-bottom: 15px;
    }
    .info-label {
      font-size: 12px;
      color: #888;
      margin-bottom: 5px;
    }
    .info-value {
      font-size: 14px;
      color: #fff;
    }
    .controls {
      margin-top: 20px;
    }
    .control-group {
      margin-bottom: 15px;
    }
    .control-label {
      display: block;
      font-size: 12px;
      color: #888;
      margin-bottom: 5px;
    }
    .size-controls {
      display: flex;
      gap: 10px;
    }
    .size-controls input {
      flex: 1;
      padding: 5px 10px;
      background: #252525;
      border: 1px solid #333;
      color: #fff;
      border-radius: 4px;
    }
    .theme-toggle {
      display: flex;
      gap: 10px;
    }
    .theme-toggle button {
      flex: 1;
      padding: 8px;
      background: #252525;
      border: 1px solid #333;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
    }
    .theme-toggle button.active {
      background: #FFD700;
      color: #000;
    }
    .permissions {
      background: #252525;
      padding: 10px;
      border-radius: 4px;
      font-size: 12px;
    }
    .permission {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 5px;
    }
    .permission-icon {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .permission-icon.granted {
      background: #4ade80;
    }
    .permission-icon.denied {
      background: #ef4444;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  </style>
</head>
<body>
  <div class="sidebar">
    <h2 style="color: #FFD700; margin-bottom: 20px;">Element Info</h2>
    
    <div class="info-item">
      <div class="info-label">Name</div>
      <div class="info-value">${manifest.name}</div>
    </div>
    
    <div class="info-item">
      <div class="info-label">Version</div>
      <div class="info-value">${manifest.version}</div>
    </div>
    
    <div class="info-item">
      <div class="info-label">Category</div>
      <div class="info-value">${manifest.category}</div>
    </div>
    
    <div class="info-item">
      <div class="info-label">Required Tier</div>
      <div class="info-value" style="text-transform: uppercase;">${manifest.tierRequired}</div>
    </div>
    
    <div class="info-item">
      <div class="info-label">Author</div>
      <div class="info-value">${manifest.author}</div>
    </div>
    
    <div class="controls">
      <h3 style="color: #FFD700; margin-bottom: 15px;">Preview Controls</h3>
      
      <div class="control-group">
        <label class="control-label">Element Size</label>
        <div class="size-controls">
          <input type="number" id="width" value="${manifest.defaultSize.width}" min="${manifest.minSize.width}" max="${manifest.maxSize.width}">
          <span style="color: #888;">×</span>
          <input type="number" id="height" value="${manifest.defaultSize.height}" min="${manifest.minSize.height}" max="${manifest.maxSize.height}">
        </div>
      </div>
      
      <div class="control-group">
        <label class="control-label">Theme</label>
        <div class="theme-toggle">
          <button id="theme-dark" class="active">Dark</button>
          <button id="theme-light">Light</button>
        </div>
      </div>
    </div>
    
    <div class="info-item">
      <div class="info-label">Permissions</div>
      <div class="permissions">
        ${Object.entries(manifest.permissions || {})
        .filter(([key, value]) => typeof value === 'boolean')
        .map(([key, value]) => `
            <div class="permission">
              <div class="permission-icon ${value ? 'granted' : 'denied'}"></div>
              <span>${key}</span>
            </div>
          `).join('')}
      </div>
    </div>
  </div>
  
  <div class="main">
    <div class="header">
      <h1 style="color: #FFD700;">Element Preview</h1>
      <p style="color: #888; margin-top: 5px;">Development server running on port ${port}</p>
    </div>
    
    <div class="preview-container">
      <div class="element-frame" id="element-frame">
        <div class="element-header">
          <span style="font-size: 14px;">${manifest.name}</span>
          <div style="display: flex; gap: 8px;">
            <button style="width: 12px; height: 12px; border-radius: 50%; background: #fbbf24; border: none;"></button>
            <button style="width: 12px; height: 12px; border-radius: 50%; background: #34d399; border: none;"></button>
            <button style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444; border: none;"></button>
          </div>
        </div>
        <div class="element-content" id="element-content">
          <iframe id="element-iframe" src="http://localhost:${port}"></iframe>
        </div>
      </div>
    </div>
  </div>
  
  <script>
    // Size controls
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const elementContent = document.getElementById('element-content');
    
    function updateSize() {
      const width = parseInt(widthInput.value);
      const height = parseInt(heightInput.value);
      elementContent.style.width = width + 'px';
      elementContent.style.height = height + 'px';
    }
    
    widthInput.addEventListener('input', updateSize);
    heightInput.addEventListener('input', updateSize);
    updateSize();
    
    // Theme toggle
    const themeDark = document.getElementById('theme-dark');
    const themeLight = document.getElementById('theme-light');
    const iframe = document.getElementById('element-iframe');
    
    themeDark.addEventListener('click', () => {
      themeDark.classList.add('active');
      themeLight.classList.remove('active');
      iframe.contentWindow.postMessage({ type: 'theme', theme: 'dark' }, '*');
    });
    
    themeLight.addEventListener('click', () => {
      themeLight.classList.add('active');
      themeDark.classList.remove('active');
      iframe.contentWindow.postMessage({ type: 'theme', theme: 'light' }, '*');
    });
    
    // Hot reload
    if (module.hot) {
      module.hot.accept();
    }
  </script>
</body>
</html>
  `;
}
function generateAPIDocs() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DEFAI Element API Documentation</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.5.0/swagger-ui.css">
  <style>
    body { margin: 0; background: #0a0a0a; }
    #swagger-ui { background: #1a1a1a; }
    .swagger-ui .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.5.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: "/api/openapi.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        theme: "dark"
      });
    };
  </script>
</body>
</html>
  `;
}
//# sourceMappingURL=dev.js.map