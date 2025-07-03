import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { cosmiconfig } from 'cosmiconfig';

const CONFIG_NAME = 'defai-element';
const CONFIG_DIR = path.join(os.homedir(), '.defai');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export interface CliConfig {
  apiKey?: string;
  apiUrl?: string;
  defaultTemplate?: string;
  analytics?: boolean;
  telemetry?: boolean;
}

const defaultConfig: CliConfig = {
  apiUrl: 'https://api.defai.com',
  defaultTemplate: 'react',
  analytics: true,
  telemetry: true
};

export class ConfigManager {
  private explorer = cosmiconfig(CONFIG_NAME);

  async load(): Promise<CliConfig> {
    try {
      // Try to load from cosmiconfig first (looks for .defai-elementrc, etc.)
      const result = await this.explorer.search();
      if (result) {
        return { ...defaultConfig, ...result.config };
      }

      // Fall back to config file
      if (fs.existsSync(CONFIG_FILE)) {
        const config = await fs.readJson(CONFIG_FILE);
        return { ...defaultConfig, ...config };
      }

      return defaultConfig;
    } catch (error) {
      return defaultConfig;
    }
  }

  async save(config: Partial<CliConfig>): Promise<void> {
    try {
      await fs.ensureDir(CONFIG_DIR);
      const currentConfig = await this.load();
      const newConfig = { ...currentConfig, ...config };
      await fs.writeJson(CONFIG_FILE, newConfig, { spaces: 2 });
    } catch (error) {
      throw new Error(`Failed to save config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async get(key: keyof CliConfig): Promise<any> {
    const config = await this.load();
    return config[key];
  }

  async set(key: keyof CliConfig, value: any): Promise<void> {
    await this.save({ [key]: value });
  }

  async reset(): Promise<void> {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        await fs.remove(CONFIG_FILE);
      }
    } catch (error) {
      throw new Error(`Failed to reset config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const configManager = new ConfigManager(); 