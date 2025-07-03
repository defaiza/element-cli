import { Logger } from '../utils/logger';

const logger = new Logger();

export async function statsCommand() {
  try {
    logger.info('Stats command not yet implemented');
    logger.info('This would show element usage statistics');
  } catch (error) {
    logger.error(`Stats error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
} 