"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const package_json_1 = require("../package.json");
const create_1 = require("./commands/create");
const dev_1 = require("./commands/dev");
const build_1 = require("./commands/build");
const validate_1 = require("./commands/validate");
const publish_1 = require("./commands/publish");
const login_1 = require("./commands/login");
const stats_1 = require("./commands/stats");
const list_1 = require("./commands/list");
const config_1 = require("./commands/config");
const test_1 = require("./commands/test");
const logger_1 = require("./utils/logger");
const program = new commander_1.Command();
const logger = new logger_1.Logger();
// ASCII Art Logo
const logo = chalk_1.default.yellow(`
   ____  _____ _____ _    ___ 
  |  _ \\| ____|  ___/ \\  |_ _|
  | | | |  _| | |_ / _ \\  | | 
  | |_| | |___|  _/ ___ \\ | | 
  |____/|_____|_|/_/   \\_\\___|
  Element Development Kit v${package_json_1.version}
`);
program
    .name('defai-element')
    .description('CLI tool for developing and publishing DEFAI elements')
    .version(package_json_1.version)
    .addHelpText('before', logo);
// Create new element
program
    .command('create <name>')
    .description('Create a new element project')
    .option('-t, --template <template>', 'Use a specific template', 'react')
    .option('-d, --directory <dir>', 'Directory to create the element in')
    .option('--typescript', 'Use TypeScript (default)', true)
    .option('--javascript', 'Use JavaScript instead of TypeScript')
    .action(create_1.createCommand);
// Development server
program
    .command('dev')
    .description('Start the development server')
    .option('-p, --port <port>', 'Port to run the dev server on', '3000')
    .option('-h, --host <host>', 'Host to run the dev server on', 'localhost')
    .option('--no-open', 'Do not open browser automatically')
    .option('--hot', 'Enable hot module replacement', true)
    .action(dev_1.devCommand);
// Build element
program
    .command('build')
    .description('Build the element for production')
    .option('-o, --output <dir>', 'Output directory', 'dist')
    .option('--analyze', 'Analyze bundle size')
    .option('--source-maps', 'Generate source maps')
    .option('--minify', 'Minify the output', true)
    .action(build_1.buildCommand);
// Validate element
program
    .command('validate')
    .description('Validate element code and configuration')
    .option('--fix', 'Automatically fix issues when possible')
    .option('--strict', 'Enable strict validation mode')
    .option('--security-only', 'Run only security checks')
    .action(validate_1.validateCommand);
// Publish element
program
    .command('publish')
    .description('Publish element to the DEFAI marketplace')
    .option('--tier <tier>', 'Required user tier (free, bronze, silver, gold, titanium)')
    .option('--price <price>', 'Price in DEFAI tokens (0 for free)')
    .option('--royalty <percentage>', 'Royalty percentage (0-20)', '5')
    .option('--dry-run', 'Simulate publish without uploading')
    .option('--skip-validation', 'Skip validation checks (not recommended)')
    .action(publish_1.publishCommand);
// Login to developer account
program
    .command('login')
    .description('Login to your DEFAI developer account')
    .option('--wallet <address>', 'Wallet address to login with')
    .option('--key <key>', 'API key for authentication')
    .action(login_1.loginCommand);
// Logout
program
    .command('logout')
    .description('Logout from your DEFAI developer account')
    .action(() => {
    logger.info('Logging out...');
    // Implementation
});
// View element statistics
program
    .command('stats [elementId]')
    .description('View statistics for your elements')
    .option('-d, --days <days>', 'Number of days to show', '30')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .action(stats_1.statsCommand);
// List elements
program
    .command('list')
    .description('List your published elements')
    .option('--all', 'Show all elements including unpublished')
    .option('--sort <field>', 'Sort by field (name, downloads, revenue)', 'name')
    .action(list_1.listCommand);
// Test element
program
    .command('test')
    .description('Run element tests')
    .option('--watch', 'Run tests in watch mode')
    .option('--coverage', 'Generate coverage report')
    .option('--e2e', 'Run end-to-end tests')
    .action(test_1.testCommand);
// Configuration
program
    .command('config')
    .description('Manage CLI configuration')
    .option('--get <key>', 'Get a configuration value')
    .option('--set <key=value>', 'Set a configuration value')
    .option('--list', 'List all configuration values')
    .option('--reset', 'Reset configuration to defaults')
    .action(config_1.configCommand);
// Init (alias for create in current directory)
program
    .command('init')
    .description('Initialize a element in the current directory')
    .option('-t, --template <template>', 'Use a specific template', 'react')
    .action((options) => {
    (0, create_1.createCommand)('.', { ...options, directory: '.' });
});
// Templates command
program
    .command('templates')
    .description('List available element templates')
    .action(() => {
    logger.info('Available templates:');
    logger.info('  • react - React-based element (default)');
    logger.info('  • vue - Vue.js element');
    logger.info('  • vanilla - Vanilla JavaScript element');
    logger.info('  • game - Game element with canvas');
    logger.info('  • chart - Data visualization element');
    logger.info('  • trading - Trading tools element');
});
// Info command
program
    .command('info')
    .description('Display environment and configuration info')
    .action(() => {
    logger.info(`DEFAI Element CLI v${package_json_1.version}`);
    logger.info(`Node.js: ${process.version}`);
    logger.info(`Platform: ${process.platform}`);
    logger.info(`Architecture: ${process.arch}`);
    // Add more info
});
// Docs command
program
    .command('docs')
    .description('Open documentation in browser')
    .action(async () => {
    const open = (await Promise.resolve().then(() => __importStar(require('open')))).default;
    await open('https://docs.defai.com/elements');
});
// Handle unknown commands
program.on('command:*', () => {
    logger.error(`Invalid command: ${program.args.join(' ')}`);
    logger.info('Run "defai-element --help" for a list of available commands.');
    process.exit(1);
});
// Parse arguments
program.parse(process.argv);
// Show help if no command provided
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=cli.js.map