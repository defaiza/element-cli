import webpack from 'webpack';
import ora from 'ora';
import { Logger } from '../utils/logger';
import { getWebpackConfig } from '../config/webpack.config';
import { validateProject } from '../utils/validators';

const logger = new Logger();

interface BuildOptions {
  output: string;
  analyze: boolean;
  sourceMaps: boolean;
  minify: boolean;
}

export async function buildCommand(options: BuildOptions) {
  const spinner = ora();
  
  try {
    // Validate project
    const projectDir = process.cwd();
    const validation = await validateProject(projectDir);
    
    if (!validation.valid) {
      logger.error('Invalid element project:');
      validation.errors.forEach(err => logger.error(`  • ${err}`));
      process.exit(1);
    }

    spinner.start('Building element...');

    // Get webpack configuration
    const webpackConfig = getWebpackConfig({
      mode: 'production',
      projectDir,
      analyze: options.analyze,
      sourceMaps: options.sourceMaps,
      minify: options.minify
    });

    // Create compiler
    const compiler = webpack(webpackConfig);

    // Run build
    compiler.run((err, stats) => {
      if (err) {
        spinner.fail('Build failed');
        logger.error(err.message);
        process.exit(1);
      }

      if (stats?.hasErrors()) {
        spinner.fail('Build failed');
        console.error(stats.toString({ colors: true }));
        process.exit(1);
      }

      spinner.succeed('Build completed successfully!');
      
      if (stats) {
        const info = stats.toJson();
        logger.info(`\nBuild output: ${options.output}`);
        logger.info(`Bundle size: ${(info.assets?.[0]?.size || 0) / 1024} KB`);
      }
    });

  } catch (error) {
    spinner.fail('Build failed');
    logger.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
} 