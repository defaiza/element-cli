import chalk from 'chalk';

export class Logger {
  /**
   * Log an info message
   */
  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  /**
   * Log a success message
   */
  success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  /**
   * Log a warning message
   */
  warn(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  /**
   * Log an error message
   */
  error(message: string): void {
    console.error(chalk.red('✗'), message);
  }

  /**
   * Log a debug message (only in debug mode)
   */
  debug(message: string): void {
    if (process.env.DEBUG) {
      console.log(chalk.gray('🔍'), message);
    }
  }

  /**
   * Log a step in a process
   */
  step(message: string): void {
    console.log(chalk.cyan('→'), message);
  }

  /**
   * Log a table
   */
  table(data: any[]): void {
    console.table(data);
  }

  /**
   * Clear the console
   */
  clear(): void {
    console.clear();
  }

  /**
   * Log a separator line
   */
  separator(): void {
    console.log(chalk.gray('─'.repeat(50)));
  }

  /**
   * Log a header
   */
  header(title: string): void {
    console.log('\n' + chalk.bold.cyan(title));
    console.log(chalk.gray('─'.repeat(title.length)));
  }
} 