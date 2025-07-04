import inquirer from 'inquirer';
import { Logger } from '../utils/logger';
import { createApiClient } from '../services/api';
import { configManager } from '../utils/config';

const logger = new Logger();

interface LoginAnswers {
  email: string;
  password: string;
}

export async function loginCommand() {
  try {
    logger.info('Login to DEFAI Platform');
    
    // Check if already logged in
    const existingToken = await configManager.get('apiKey');
    if (existingToken) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'You are already logged in. Do you want to login with a different account?',
          default: false
        }
      ]);
      
      if (!overwrite) {
        logger.info('Login cancelled');
        return;
      }
    }
    
    // Prompt for credentials
    const answers = await inquirer.prompt<LoginAnswers>([
      {
        type: 'input',
        name: 'email',
        message: 'Email:',
        validate: (input) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(input) || 'Please enter a valid email address';
        }
      },
      {
        type: 'password',
        name: 'password',
        message: 'Password:',
        mask: '*',
        validate: (input) => {
          return input.length > 0 || 'Password is required';
        }
      }
    ]);
    
    logger.loading('Authenticating...');
    
    // Create API client and attempt login
    const apiClient = await createApiClient();
    const { token, user } = await apiClient.login(answers.email, answers.password);
    
    // Save token to config
    await configManager.save({
      apiKey: token,
      userEmail: user.email,
      userId: user.id
    });
    
    logger.success(`Successfully logged in as ${user.email}`);
    logger.info(`Welcome back, ${user.name || user.email}!`);
    
    // Show account info
    if (user.subscription) {
      logger.info(`Subscription: ${user.subscription.tier} (expires: ${new Date(user.subscription.expiresAt).toLocaleDateString()})`);
    }
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('401')) {
      logger.error('Invalid email or password');
    } else if (error instanceof Error && error.message.includes('network')) {
      logger.error('Network error. Please check your internet connection');
    } else {
      logger.error(`Login error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    process.exit(1);
  }
}

export async function logoutCommand() {
  try {
    const isLoggedIn = await configManager.get('apiKey');
    
    if (!isLoggedIn) {
      logger.info('You are not logged in');
      return;
    }
    
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to logout?',
        default: false
      }
    ]);
    
    if (confirm) {
      // Remove auth-related config
      await configManager.save({
        apiKey: undefined,
        userEmail: undefined,
        userId: undefined
      });
      
      logger.success('Successfully logged out');
    } else {
      logger.info('Logout cancelled');
    }
    
  } catch (error) {
    logger.error(`Logout error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
} 