import { Logger } from '../utils/logger';
import { validateProject } from '../utils/validators';

const logger = new Logger();

interface ValidateOptions {
  fix: boolean;
  strict: boolean;
  securityOnly: boolean;
}

export async function validateCommand(options: ValidateOptions) {
  try {
    const projectDir = process.cwd();
    const validation = await validateProject(projectDir);
    
    if (validation.valid) {
      logger.success('Element validation passed!');
    } else {
      logger.error('Element validation failed:');
      validation.errors.forEach(err => logger.error(`  • ${err}`));
      process.exit(1);
    }
  } catch (error) {
    logger.error(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
} 