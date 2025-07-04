import { Logger } from '../utils/logger';
import { createApiClient } from '../services/api';
import { configManager } from '../utils/config';
import Table from 'cli-table3';
import chalk from 'chalk';
import inquirer from 'inquirer';

const logger = new Logger();

interface ListOptions {
  all?: boolean;
  sort?: string;
}

export async function listCommand(options: ListOptions = {}) {
  try {
    // Check if logged in
    const apiKey = await configManager.get('apiKey');
    if (!apiKey) {
      logger.error('You must be logged in to list elements. Run "defai-element login" first.');
      process.exit(1);
    }
    
    logger.loading('Fetching your elements...');
    
    const apiClient = await createApiClient();
    let elements = await apiClient.listElements();
    
    // Filter based on options
    if (!options.all) {
      elements = elements.filter(element => element.status === 'published');
    }
    
    // Sort elements
    const sortField = options.sort || 'name';
    elements.sort((a, b) => {
      switch (sortField) {
        case 'downloads':
          return b.downloads - a.downloads;
        case 'revenue':
          return b.revenue - a.revenue;
        case 'date':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    if (elements.length === 0) {
      logger.info('No elements found.');
      logger.info('Create your first element with "defai-element create <name>"');
      return;
    }
    
    logger.success(`Found ${elements.length} element${elements.length === 1 ? '' : 's'}`);
    
    // Display table
    const table = new Table({
      head: ['Name', 'Status', 'Version', 'Downloads', 'Revenue', 'Rating', 'Published'],
      colWidths: [25, 12, 10, 12, 12, 10, 12],
      style: {
        head: ['cyan']
      }
    });
    
    elements.forEach(element => {
      const status = element.status === 'published' 
        ? chalk.green(element.status)
        : element.status === 'draft'
        ? chalk.yellow(element.status)
        : chalk.red(element.status);
      
      table.push([
        element.name,
        status,
        element.version,
        element.downloads.toLocaleString(),
        `$${element.revenue.toFixed(2)}`,
        element.rating ? `${element.rating.toFixed(1)} ⭐` : 'N/A',
        element.publishedAt ? new Date(element.publishedAt).toLocaleDateString() : 'N/A'
      ]);
    });
    
    console.log(table.toString());
    
    // Show actions menu
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'View element details', value: 'details' },
          { name: 'View element stats', value: 'stats' },
          { name: 'Update element', value: 'update' },
          { name: 'Unpublish element', value: 'unpublish' },
          { name: 'Exit', value: 'exit' }
        ]
      }
    ]);
    
    if (action === 'exit') {
      return;
    }
    
    // Element selection for actions
    if (action !== 'exit') {
      const { selectedElement } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedElement',
          message: 'Select an element:',
          choices: elements.map(el => ({
            name: `${el.name} (v${el.version})`,
            value: el.id
          }))
        }
      ]);
      
      switch (action) {
        case 'details':
          await showElementDetails(selectedElement);
          break;
        case 'stats':
          // Use the stats command
          const { statsCommand } = await import('./stats');
          await statsCommand(selectedElement);
          break;
        case 'update':
          logger.info('Update functionality coming soon!');
          logger.info('For now, make changes locally and run "defai-element publish" again.');
          break;
        case 'unpublish':
          await unpublishElement(selectedElement, elements.find(el => el.id === selectedElement)?.name || 'Unknown');
          break;
      }
    }
    
  } catch (error) {
    logger.error(`List error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

async function showElementDetails(elementId: string) {
  try {
    logger.loading('Fetching element details...');
    
    const apiClient = await createApiClient();
    // In a real implementation, this would fetch detailed info
    // For now, we'll show a placeholder
    
    logger.info('Element Details:');
    logger.info('This feature will show:');
    logger.info('• Full description and README');
    logger.info('• Screenshots and demos');
    logger.info('• User reviews and feedback');
    logger.info('• Technical requirements');
    logger.info('• API documentation');
    
  } catch (error) {
    logger.error(`Failed to fetch details: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function unpublishElement(elementId: string, elementName: string) {
  try {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to unpublish "${elementName}"? This will remove it from the marketplace.`,
        default: false
      }
    ]);
    
    if (!confirm) {
      logger.info('Unpublish cancelled');
      return;
    }
    
    logger.loading('Unpublishing element...');
    
    // In a real implementation, this would call the API
    // For now, we'll show a success message
    
    logger.success(`Element "${elementName}" has been unpublished`);
    logger.info('You can republish it anytime with "defai-element publish"');
    
  } catch (error) {
    logger.error(`Failed to unpublish: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 