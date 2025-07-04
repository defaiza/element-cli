import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import archiver from 'archiver';
import { Logger } from '../utils/logger';
import { createApiClient } from '../services/api';
import { configManager } from '../utils/config';
import { validateCommand } from './validate';

const logger = new Logger();

interface PublishOptions {
  tier?: string;
  price?: string;
  royalty?: string;
  dryRun?: boolean;
  skipValidation?: boolean;
}

interface PublishAnswers {
  name: string;
  description: string;
  version: string;
  tier: string;
  price: number;
  royalty: number;
  category: string;
  tags: string;
  screenshots: string[];
}

export async function publishCommand(options: PublishOptions) {
  try {
    logger.info('Publishing element to DEFAI marketplace');
    
    // Check if logged in
    const apiKey = await configManager.get('apiKey');
    if (!apiKey) {
      logger.error('You must be logged in to publish. Run "defai-element login" first.');
      process.exit(1);
    }
    
    // Check if in a valid element project
    const manifestPath = path.join(process.cwd(), 'defai-element.json');
    if (!fs.existsSync(manifestPath)) {
      logger.error('No defai-element.json found in current directory.');
      logger.info('Make sure you are in an element project directory.');
      process.exit(1);
    }
    
    // Load manifest
    const manifest = await fs.readJson(manifestPath);
    
    // Run validation unless skipped
    if (!options.skipValidation) {
      logger.info('Running validation checks...');
      await validateCommand({ fix: false, strict: true, securityOnly: false });
    }
    
    // Check if build exists
    const distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distPath)) {
      logger.error('No build found. Run "defai-element build" first.');
      process.exit(1);
    }
    
    // Gather publish metadata
    const answers = await inquirer.prompt<PublishAnswers>([
      {
        type: 'input',
        name: 'name',
        message: 'Element name:',
        default: manifest.name,
        validate: (input) => input.length > 0 || 'Name is required'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description:',
        default: manifest.description,
        validate: (input) => input.length > 0 || 'Description is required'
      },
      {
        type: 'input',
        name: 'version',
        message: 'Version:',
        default: manifest.version || '1.0.0',
        validate: (input) => {
          const semverRegex = /^\d+\.\d+\.\d+$/;
          return semverRegex.test(input) || 'Version must be in semver format (x.y.z)';
        }
      },
      {
        type: 'list',
        name: 'tier',
        message: 'Required user tier:',
        choices: ['free', 'bronze', 'silver', 'gold', 'titanium'],
        default: options.tier || 'free'
      },
      {
        type: 'number',
        name: 'price',
        message: 'Price in DEFAI tokens (0 for free):',
        default: options.price ? parseFloat(options.price) : 0,
        validate: (input) => input >= 0 || 'Price must be 0 or positive'
      },
      {
        type: 'number',
        name: 'royalty',
        message: 'Royalty percentage (0-20):',
        default: options.royalty ? parseFloat(options.royalty) : 5,
        validate: (input) => input >= 0 && input <= 20 || 'Royalty must be between 0 and 20'
      },
      {
        type: 'list',
        name: 'category',
        message: 'Category:',
        choices: [
          'productivity',
          'entertainment',
          'finance',
          'social',
          'gaming',
          'developer-tools',
          'data-visualization',
          'ai-ml',
          'other'
        ],
        default: manifest.category || 'other'
      },
      {
        type: 'input',
        name: 'tags',
        message: 'Tags (comma-separated):',
        default: manifest.tags?.join(', ') || ''
      }
    ]);
    
    // Check for screenshots
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    let screenshots: string[] = [];
    if (fs.existsSync(screenshotsDir)) {
      screenshots = fs.readdirSync(screenshotsDir)
        .filter(file => /\.(png|jpg|jpeg|gif)$/i.test(file))
        .map(file => path.join(screenshotsDir, file));
    }
    
    if (screenshots.length === 0) {
      logger.warn('No screenshots found. Consider adding screenshots to improve discoverability.');
    }
    
    // Update manifest with publish metadata
    const updatedManifest = {
      ...manifest,
      name: answers.name,
      description: answers.description,
      version: answers.version,
      category: answers.category,
      tags: answers.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      tier: answers.tier,
      price: answers.price,
      royalty: answers.royalty,
      publishedAt: new Date().toISOString()
    };
    
    await fs.writeJson(manifestPath, updatedManifest, { spaces: 2 });
    
    if (options.dryRun) {
      logger.info('Dry run mode - not actually publishing');
      logger.info('Element metadata:');
      console.log(updatedManifest);
      return;
    }
    
    // Create bundle
    logger.loading('Creating element bundle...');
    const bundlePath = await createBundle(distPath, updatedManifest);
    
    // Upload to marketplace
    logger.loading('Uploading to DEFAI marketplace...');
    const apiClient = await createApiClient();
    
    try {
      const result = await apiClient.publish({
        elementPath: process.cwd(),
        tier: answers.tier,
        price: answers.price,
        royalty: answers.royalty
      });
      
      logger.success(`Element published successfully!`);
      logger.info(`Element ID: ${result.elementId}`);
      logger.info(`View at: ${result.url}`);
      
      // Save element ID to manifest
      updatedManifest.elementId = result.elementId;
      await fs.writeJson(manifestPath, updatedManifest, { spaces: 2 });
      
    } catch (error) {
      // Clean up bundle on error
      await fs.remove(bundlePath);
      throw error;
    }
    
  } catch (error) {
    logger.error(`Publish error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

async function createBundle(distPath: string, manifest: any): Promise<string> {
  const bundlePath = path.join(distPath, 'element.zip');
  
  // Remove existing bundle
  if (fs.existsSync(bundlePath)) {
    await fs.remove(bundlePath);
  }
  
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(bundlePath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });
    
    output.on('close', () => {
      logger.info(`Bundle created: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
      resolve(bundlePath);
    });
    
    archive.on('error', reject);
    
    archive.pipe(output);
    
    // Add manifest
    archive.append(JSON.stringify(manifest, null, 2), { name: 'manifest.json' });
    
    // Add dist files
    archive.directory(distPath, false);
    
    // Add README if exists
    const readmePath = path.join(process.cwd(), 'README.md');
    if (fs.existsSync(readmePath)) {
      archive.file(readmePath, { name: 'README.md' });
    }
    
    // Add screenshots if exists
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    if (fs.existsSync(screenshotsDir)) {
      archive.directory(screenshotsDir, 'screenshots');
    }
    
    archive.finalize();
  });
} 