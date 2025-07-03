import fs from 'fs-extra';
import path from 'path';

/**
 * Validates an element name
 * @param name - The element name to validate
 * @returns true if valid, false otherwise
 */
export function validateElementName(name: string): boolean {
  // Must be lowercase letters, numbers, and hyphens only
  const validPattern = /^[a-z0-9-]+$/;
  
  // Must start with a letter
  const startsWithLetter = /^[a-z]/;
  
  // Must end with a letter or number
  const endsWithValid = /[a-z0-9]$/;
  
  // Length between 3 and 50 characters
  const validLength = name.length >= 3 && name.length <= 50;
  
  // No consecutive hyphens
  const noConsecutiveHyphens = !/--/.test(name);
  
  return validPattern.test(name) && 
         startsWithLetter.test(name) && 
         endsWithValid.test(name) && 
         validLength && 
         noConsecutiveHyphens;
}

/**
 * Validates a project directory structure
 * @param projectDir - The project directory to validate
 * @returns Validation result with errors array
 */
export async function validateProject(projectDir: string): Promise<{
  valid: boolean;
  errors: string[];
}> {
  const errors: string[] = [];
  
  try {
    // Check if directory exists
    if (!fs.existsSync(projectDir)) {
      errors.push('Project directory does not exist');
      return { valid: false, errors };
    }
    
    // Check for required files
    const requiredFiles = [
      'package.json',
      'manifest.json',
      'src/index.tsx',
      'src/index.jsx'
    ];
    
    for (const file of requiredFiles) {
      const filePath = path.join(projectDir, file);
      if (!fs.existsSync(filePath)) {
        errors.push(`Missing required file: ${file}`);
      }
    }
    
    // Check package.json structure
    const packageJsonPath = path.join(projectDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = fs.readJsonSync(packageJsonPath);
        
        if (!packageJson.name) {
          errors.push('package.json missing "name" field');
        }
        
        if (!packageJson.defaiElement) {
          errors.push('package.json missing "defaiElement" configuration');
        }
      } catch (error) {
        errors.push('Invalid package.json format');
      }
    }
    
    // Check manifest.json structure
    const manifestPath = path.join(projectDir, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      try {
        const manifest = fs.readJsonSync(manifestPath);
        
        const requiredManifestFields = [
          'id', 'name', 'version', 'description', 'author', 
          'category', 'tierRequired', 'defaultSize', 'minSize', 'maxSize'
        ];
        
        for (const field of requiredManifestFields) {
          if (!manifest[field]) {
            errors.push(`manifest.json missing "${field}" field`);
          }
        }
      } catch (error) {
        errors.push('Invalid manifest.json format');
      }
    }
    
    // Check for source files
    const srcDir = path.join(projectDir, 'src');
    if (!fs.existsSync(srcDir)) {
      errors.push('Missing src directory');
    } else {
      const hasTsx = fs.existsSync(path.join(srcDir, 'index.tsx'));
      const hasJsx = fs.existsSync(path.join(srcDir, 'index.jsx'));
      
      if (!hasTsx && !hasJsx) {
        errors.push('Missing source file: src/index.tsx or src/index.jsx');
      }
    }
    
  } catch (error) {
    errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates element permissions
 * @param permissions - Permissions object to validate
 * @returns true if valid, false otherwise
 */
export function validatePermissions(permissions: Record<string, boolean>): boolean {
  const validPermissions = [
    'wallet',
    'network',
    'storage',
    'notifications',
    'camera',
    'microphone',
    'location',
    'clipboard'
  ];
  
  return Object.keys(permissions).every(key => 
    validPermissions.includes(key) && typeof permissions[key] === 'boolean'
  );
}

/**
 * Validates element size constraints
 * @param size - Size object to validate
 * @returns true if valid, false otherwise
 */
export function validateSize(size: { width: number; height: number }): boolean {
  return typeof size.width === 'number' && 
         typeof size.height === 'number' && 
         size.width > 0 && 
         size.height > 0 &&
         size.width <= 1920 && 
         size.height <= 1080;
} 