import archiver from 'archiver';
import fs from 'fs-extra';
import path from 'path';
import { Logger } from './logger';

const logger = new Logger();

export interface BundleOptions {
  sourceDir: string;
  outputPath: string;
  exclude?: string[];
}

export async function createBundle(options: BundleOptions): Promise<void> {
  const { sourceDir, outputPath, exclude = [] } = options;
  
  // Ensure output directory exists
  await fs.ensureDir(path.dirname(outputPath));
  
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    output.on('close', () => {
      const size = (archive.pointer() / 1024 / 1024).toFixed(2);
      logger.info(`Bundle created: ${outputPath} (${size} MB)`);
      resolve();
    });

    archive.on('error', (err: Error) => {
      reject(new Error(`Bundle creation failed: ${err.message}`));
    });

    archive.pipe(output);

    // Add manifest
    const manifestPath = path.join(sourceDir, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      archive.file(manifestPath, { name: 'manifest.json' });
    }

    // Add dist folder
    const distPath = path.join(sourceDir, 'dist');
    if (fs.existsSync(distPath)) {
      archive.directory(distPath, 'dist');
    }

    // Add package.json (without devDependencies)
    const packageJsonPath = path.join(sourceDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = fs.readJsonSync(packageJsonPath);
      delete packageJson.devDependencies;
      archive.append(JSON.stringify(packageJson, null, 2), { name: 'package.json' });
    }

    // Add README
    const readmePath = path.join(sourceDir, 'README.md');
    if (fs.existsSync(readmePath)) {
      archive.file(readmePath, { name: 'README.md' });
    }

    // Add LICENSE if exists
    const licensePath = path.join(sourceDir, 'LICENSE');
    if (fs.existsSync(licensePath)) {
      archive.file(licensePath, { name: 'LICENSE' });
    }

    archive.finalize();
  });
}

export async function validateBundle(bundlePath: string): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  if (!fs.existsSync(bundlePath)) {
    errors.push('Bundle file does not exist');
    return { valid: false, errors };
  }

  // Check file size
  const stats = await fs.stat(bundlePath);
  const sizeMB = stats.size / 1024 / 1024;
  
  if (sizeMB > 50) {
    errors.push(`Bundle size (${sizeMB.toFixed(2)} MB) exceeds maximum allowed size (50 MB)`);
  }

  // TODO: Add more validation (extract and check contents)

  return {
    valid: errors.length === 0,
    errors
  };
} 