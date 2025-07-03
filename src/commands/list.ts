import { Logger } from '../utils/logger';

const logger = new Logger();

interface ListOptions {
  all: boolean;
  sort: string;
}

export async function listCommand(options: ListOptions) {
  try {
    logger.info('List command not yet implemented');
    logger.info('This would list published elements');
  } catch (error) {
    logger.error(`List error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
} 