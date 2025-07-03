import { Command } from 'commander';
import chalk from 'chalk';
import { version } from '../package.json';
import { createCommand } from './commands/create';
import { devCommand } from './commands/dev';
import { buildCommand } from './commands/build';
import { validateCommand } from './commands/validate';
import { publishCommand } from './commands/publish';
import { loginCommand } from './commands/login';
import { statsCommand } from './commands/stats';
import { listCommand } from './commands/list';
import { configCommand } from './commands/config';
import { testCommand } from './commands/test';
import { Logger } from './utils/logger';

const program = new Command();
const logger = new Logger();

// ASCII Art Logo
const logo = chalk.yellow(`
   ____  _____ _____ _    ___ 
  |  _ \\| ____|  ___/ \\  |_ _|
  | | | |  _| | |_ / _ \\  | | 
  | |_| | |___|  _/ ___ \\ | | 
  |____/|_____|_|/_/   \\_\\___|
  Element Development Kit v${version}
`);

program
  .name('defai-element')
  .description('CLI tool for developing and publishing DEFAI elements')
  .version(version)
  .addHelpText('before', logo);

// Create new element
program
  .command('create <name>')
  .description('Create a new element project')
  .option('-t, --template <template>', 'Use a specific template', 'react')
  .option('-d, --directory <dir>', 'Directory to create the element in')
  .option('--typescript', 'Use TypeScript (default)', true)
  .option('--javascript', 'Use JavaScript instead of TypeScript')
  .action(createCommand);

// Development server
program
  .command('dev')
  .description('Start the development server')
  .option('-p, --port <port>', 'Port to run the dev server on', '3000')
  .option('-h, --host <host>', 'Host to run the dev server on', 'localhost')
  .option('--no-open', 'Do not open browser automatically')
  .option('--hot', 'Enable hot module replacement', true)
  .action(devCommand);

// Build element
program
  .command('build')
  .description('Build the element for production')
  .option('-o, --output <dir>', 'Output directory', 'dist')
  .option('--analyze', 'Analyze bundle size')
  .option('--source-maps', 'Generate source maps')
  .option('--minify', 'Minify the output', true)
  .action(buildCommand);

// Validate element
program
  .command('validate')
  .description('Validate element code and configuration')
  .option('--fix', 'Automatically fix issues when possible')
  .option('--strict', 'Enable strict validation mode')
  .option('--security-only', 'Run only security checks')
  .action(validateCommand);

// Publish element
program
  .command('publish')
  .description('Publish element to the DEFAI marketplace')
  .option('--tier <tier>', 'Required user tier (free, bronze, silver, gold, titanium)')
  .option('--price <price>', 'Price in DEFAI tokens (0 for free)')
  .option('--royalty <percentage>', 'Royalty percentage (0-20)', '5')
  .option('--dry-run', 'Simulate publish without uploading')
  .option('--skip-validation', 'Skip validation checks (not recommended)')
  .action(publishCommand);

// Login to developer account
program
  .command('login')
  .description('Login to your DEFAI developer account')
  .option('--wallet <address>', 'Wallet address to login with')
  .option('--key <key>', 'API key for authentication')
  .action(loginCommand);

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
  .action(statsCommand);

// List elements
program
  .command('list')
  .description('List your published elements')
  .option('--all', 'Show all elements including unpublished')
  .option('--sort <field>', 'Sort by field (name, downloads, revenue)', 'name')
  .action(listCommand);

// Test element
program
  .command('test')
  .description('Run element tests')
  .option('--watch', 'Run tests in watch mode')
  .option('--coverage', 'Generate coverage report')
  .option('--e2e', 'Run end-to-end tests')
  .action(testCommand);

// Configuration
program
  .command('config')
  .description('Manage CLI configuration')
  .option('--get <key>', 'Get a configuration value')
  .option('--set <key=value>', 'Set a configuration value')
  .option('--list', 'List all configuration values')
  .option('--reset', 'Reset configuration to defaults')
  .action(configCommand);

// Init (alias for create in current directory)
program
  .command('init')
  .description('Initialize a element in the current directory')
  .option('-t, --template <template>', 'Use a specific template', 'react')
  .action((options) => {
    createCommand('.', { ...options, directory: '.' });
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
    logger.info(`DEFAI Element CLI v${version}`);
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
    const open = (await import('open')).default;
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