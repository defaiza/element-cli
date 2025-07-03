import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import { execSync } from 'child_process';
import { Logger } from '../utils/logger';
import { validateElementName } from '../utils/validators';
import { getTemplate } from '../templates';

const logger = new Logger();

interface CreateOptions {
  template: string;
  directory?: string;
  typescript?: boolean;
  javascript?: boolean;
}

export async function createCommand(name: string, options: CreateOptions) {
  const spinner = ora();
  
  try {
    // Validate element name
    if (!validateElementName(name)) {
      logger.error('Invalid element name. Use lowercase letters, numbers, and hyphens only.');
      process.exit(1);
    }

    // Determine project directory
    const projectDir = path.resolve(options.directory || name);
    
    // Check if directory exists
    if (fs.existsSync(projectDir)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `Directory ${projectDir} already exists. Overwrite?`,
          default: false
        }
      ]);
      
      if (!overwrite) {
        logger.info('Creation cancelled.');
        return;
      }
      
      fs.removeSync(projectDir);
    }

    // Gather additional information
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'displayName',
        message: 'Element display name:',
        default: name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      },
      {
        type: 'input',
        name: 'description',
        message: 'Element description:',
        default: 'A DEFAI element'
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author name:',
        default: process.env.USER || 'Anonymous'
      },
      {
        type: 'list',
        name: 'category',
        message: 'Element category:',
        choices: [
          'Trading',
          'Analytics',
          'DEFAI',
          'Productivity',
          'AI Tools',
          'Information',
          'Utilities',
          'Games',
          'Developer Tools'
        ]
      },
      {
        type: 'list',
        name: 'tier',
        message: 'Minimum user tier required:',
        choices: [
          { name: 'Free - Available to all users', value: 'free' },
          { name: 'Bronze - Requires Bronze tier ($50+ DEFAI)', value: 'bronze' },
          { name: 'Silver - Requires Silver tier ($500+ DEFAI)', value: 'silver' },
          { name: 'Gold - Requires Gold tier ($5,000+ DEFAI)', value: 'gold' },
          { name: 'Titanium - Requires Titanium tier ($50,000+ DEFAI)', value: 'titanium' }
        ]
      },
      {
        type: 'number',
        name: 'price',
        message: 'Element price in DEFAI tokens (0 for free):',
        default: 0,
        validate: (value) => value >= 0 || 'Price must be non-negative'
      }
    ]);

    spinner.start('Creating element project...');

    // Create project directory
    fs.ensureDirSync(projectDir);

    // Get template
    const template = getTemplate(options.template);
    if (!template) {
      spinner.fail(`Template "${options.template}" not found`);
      process.exit(1);
    }

    // Copy template files
    const templateDir = path.join(__dirname, '../../templates', options.template);
    fs.copySync(templateDir, projectDir);

    // Update package.json
    const packageJsonPath = path.join(projectDir, 'package.json');
    const packageJson = fs.readJsonSync(packageJsonPath);
    packageJson.name = `@defai-element/${name}`;
    packageJson.description = answers.description;
    packageJson.author = answers.author;
    packageJson.defaiElement = {
      id: name,
      displayName: answers.displayName,
      category: answers.category,
      tier: answers.tier,
      price: answers.price
    };
    fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });

    // Update manifest.json
    const manifestPath = path.join(projectDir, 'manifest.json');
    const manifest = fs.readJsonSync(manifestPath);
    manifest.id = name;
    manifest.name = answers.displayName;
    manifest.description = answers.description;
    manifest.author = answers.author;
    manifest.category = answers.category;
    manifest.tierRequired = answers.tier;
    manifest.price = answers.price;
    fs.writeJsonSync(manifestPath, manifest, { spaces: 2 });

    // Update element source file
    const srcFile = options.typescript ? 'src/index.tsx' : 'src/index.jsx';
    const srcPath = path.join(projectDir, srcFile);
    let srcContent = fs.readFileSync(srcPath, 'utf-8');
    srcContent = srcContent
      .replace(/element-id/g, name)
      .replace(/Element Name/g, answers.displayName)
      .replace(/Element description/g, answers.description)
      .replace(/Your Name/g, answers.author)
      .replace(/'Utilities'/g, `'${answers.category}'`)
      .replace(/'free'/g, `'${answers.tier}'`);
    fs.writeFileSync(srcPath, srcContent);

    spinner.succeed('Element project created!');

    // Install dependencies
    const { installDeps } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'installDeps',
        message: 'Install dependencies now?',
        default: true
      }
    ]);

    if (installDeps) {
      spinner.start('Installing dependencies...');
      try {
        execSync('npm install', {
          cwd: projectDir,
          stdio: 'pipe'
        });
        spinner.succeed('Dependencies installed!');
      } catch (error) {
        spinner.fail('Failed to install dependencies');
        logger.warn('You can install them manually by running "npm install"');
      }
    }

    // Success message
    logger.success(`\nElement "${answers.displayName}" created successfully!`);
    logger.info('\nNext steps:');
    logger.info(`  cd ${path.relative(process.cwd(), projectDir)}`);
    if (!installDeps) {
      logger.info('  npm install');
    }
    logger.info('  defai-element dev');
    logger.info('\nHappy coding! 🚀');

  } catch (error) {
    spinner.fail('Failed to create element');
    logger.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}