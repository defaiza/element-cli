import { spawn } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { Logger } from '../utils/logger';
import inquirer from 'inquirer';

const logger = new Logger();

interface TestOptions {
  watch?: boolean;
  coverage?: boolean;
  e2e?: boolean;
}

export async function testCommand(options: TestOptions = {}) {
  try {
    logger.info('Running element tests');
    
    // Check if in a valid element project
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      logger.error('No package.json found in current directory.');
      logger.info('Make sure you are in an element project directory.');
      process.exit(1);
    }
    
    const packageJson = await fs.readJson(packageJsonPath);
    
    // Check for test configuration
    const hasJestConfig = await checkJestConfig();
    if (!hasJestConfig) {
      const { setupTests } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'setupTests',
          message: 'No test configuration found. Would you like to set up Jest?',
          default: true
        }
      ]);
      
      if (setupTests) {
        await setupJest(packageJson);
      } else {
        logger.info('Test setup cancelled');
        return;
      }
    }
    
    // Determine test command
    let testCommand = 'jest';
    const args: string[] = [];
    
    if (options.watch) {
      args.push('--watch');
    }
    
    if (options.coverage) {
      args.push('--coverage');
    }
    
    if (options.e2e) {
      // Check for e2e test setup
      const hasE2ETests = fs.existsSync(path.join(process.cwd(), 'e2e'));
      if (!hasE2ETests) {
        logger.warn('No e2e directory found. Creating e2e test structure...');
        await setupE2ETests();
      }
      args.push('--testMatch', '**/e2e/**/*.test.[jt]s?(x)');
    }
    
    // Check if test script exists in package.json
    if (packageJson.scripts?.test) {
      testCommand = 'npm';
      args.unshift('test');
      if (options.watch && !packageJson.scripts.test.includes('watch')) {
        args.push('--', '--watch');
      }
      if (options.coverage && !packageJson.scripts.test.includes('coverage')) {
        args.push('--', '--coverage');
      }
    }
    
    logger.info(`Running: ${testCommand} ${args.join(' ')}`);
    
    // Run tests
    const testProcess = spawn(testCommand, args, {
      stdio: 'inherit',
      shell: true
    });
    
    testProcess.on('close', (code) => {
      if (code === 0) {
        logger.success('All tests passed!');
        
        if (options.coverage) {
          logger.info('Coverage report generated in coverage/ directory');
          logger.info('Open coverage/lcov-report/index.html to view detailed report');
        }
      } else {
        logger.error(`Tests failed with exit code ${code}`);
        process.exit(code || 1);
      }
    });
    
    testProcess.on('error', (error) => {
      logger.error(`Failed to run tests: ${error.message}`);
      process.exit(1);
    });
    
  } catch (error) {
    logger.error(`Test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

async function checkJestConfig(): Promise<boolean> {
  const configFiles = [
    'jest.config.js',
    'jest.config.ts',
    'jest.config.json',
    'jest.config.mjs',
    'jest.config.cjs'
  ];
  
  for (const file of configFiles) {
    if (fs.existsSync(path.join(process.cwd(), file))) {
      return true;
    }
  }
  
  // Check package.json for jest config
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);
  
  return !!packageJson.jest;
}

async function setupJest(packageJson: any) {
  logger.info('Setting up Jest testing framework...');
  
  // Install Jest and related dependencies
  logger.loading('Installing test dependencies...');
  
  const deps = [
    'jest',
    '@types/jest',
    'ts-jest',
    '@testing-library/react',
    '@testing-library/jest-dom',
    '@testing-library/user-event'
  ];
  
  const installProcess = spawn('npm', ['install', '--save-dev', ...deps], {
    stdio: 'inherit',
    shell: true
  });
  
  await new Promise((resolve, reject) => {
    installProcess.on('close', (code) => {
      if (code === 0) resolve(undefined);
      else reject(new Error(`Installation failed with code ${code}`));
    });
  });
  
  // Create Jest config
  const jestConfig = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
      '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)'
    ],
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.d.ts',
      '!src/index.tsx',
      '!src/serviceWorker.ts'
    ]
  };
  
  await fs.writeJson(path.join(process.cwd(), 'jest.config.json'), jestConfig, { spaces: 2 });
  
  // Create setup file
  const setupContent = `import '@testing-library/jest-dom';

// Add custom matchers and global test setup here
`;
  
  const srcDir = path.join(process.cwd(), 'src');
  if (!fs.existsSync(srcDir)) {
    await fs.mkdir(srcDir);
  }
  
  await fs.writeFile(path.join(srcDir, 'setupTests.ts'), setupContent);
  
  // Update package.json scripts
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.test = 'jest';
  packageJson.scripts['test:watch'] = 'jest --watch';
  packageJson.scripts['test:coverage'] = 'jest --coverage';
  
  await fs.writeJson(path.join(process.cwd(), 'package.json'), packageJson, { spaces: 2 });
  
  // Create example test
  const testDir = path.join(srcDir, '__tests__');
  await fs.ensureDir(testDir);
  
  const exampleTest = `describe('Example Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
  
  it('should add numbers correctly', () => {
    const sum = (a: number, b: number) => a + b;
    expect(sum(1, 2)).toBe(3);
  });
});
`;
  
  await fs.writeFile(path.join(testDir, 'example.test.ts'), exampleTest);
  
  logger.success('Jest setup complete!');
  logger.info('Created:');
  logger.info('• jest.config.json - Jest configuration');
  logger.info('• src/setupTests.ts - Test setup file');
  logger.info('• src/__tests__/example.test.ts - Example test');
  logger.info('');
  logger.info('Run "defai-element test" to run tests');
}

async function setupE2ETests() {
  const e2eDir = path.join(process.cwd(), 'e2e');
  await fs.ensureDir(e2eDir);
  
  // Create example E2E test
  const exampleE2ETest = `describe('Element E2E Tests', () => {
  beforeAll(async () => {
    // Setup before all tests
  });
  
  afterAll(async () => {
    // Cleanup after all tests
  });
  
  it('should load the element', async () => {
    // Add your E2E test logic here
    expect(true).toBe(true);
  });
  
  it('should handle user interactions', async () => {
    // Test user interactions
    expect(true).toBe(true);
  });
});
`;
  
  await fs.writeFile(path.join(e2eDir, 'element.e2e.test.ts'), exampleE2ETest);
  
  // Create E2E config
  const e2eConfig = {
    testEnvironment: 'node',
    testMatch: ['<rootDir>/e2e/**/*.test.[jt]s'],
    testTimeout: 30000
  };
  
  await fs.writeJson(path.join(e2eDir, 'jest.config.json'), e2eConfig, { spaces: 2 });
  
  logger.success('E2E test structure created!');
} 