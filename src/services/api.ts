import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import fs from 'fs-extra';
import { configManager } from '../utils/config';

export interface PublishOptions {
  elementPath: string;
  tier: string;
  price: number;
  royalty: number;
}

export interface ElementStats {
  downloads: number;
  revenue: number;
  rating: number;
  reviews: number;
}

export class DefaiApiClient {
  private client: AxiosInstance;

  constructor(apiUrl?: string, apiKey?: string) {
    this.client = axios.create({
      baseURL: apiUrl || 'https://api.defai.com',
      headers: {
        'Authorization': apiKey ? `Bearer ${apiKey}` : '',
        'Content-Type': 'application/json'
      }
    });
  }

  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    try {
      const response = await this.client.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async publish(options: PublishOptions): Promise<{ elementId: string; url: string }> {
    try {
      const form = new FormData();
      
      // Add element bundle
      const bundlePath = `${options.elementPath}/dist/element.zip`;
      if (!fs.existsSync(bundlePath)) {
        throw new Error('Element bundle not found. Run "defai-element build" first.');
      }
      
      form.append('bundle', fs.createReadStream(bundlePath));
      form.append('tier', options.tier);
      form.append('price', options.price.toString());
      form.append('royalty', options.royalty.toString());
      
      const response = await this.client.post('/elements/publish', form, {
        headers: form.getHeaders()
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Publish failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getStats(elementId?: string): Promise<ElementStats | ElementStats[]> {
    try {
      const url = elementId ? `/elements/${elementId}/stats` : '/elements/stats';
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async listElements(): Promise<any[]> {
    try {
      const response = await this.client.get('/elements');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to list elements: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async validateElement(manifestPath: string): Promise<{ valid: boolean; errors: string[] }> {
    try {
      const manifest = await fs.readJson(manifestPath);
      const response = await this.client.post('/elements/validate', { manifest });
      return response.data;
    } catch (error) {
      throw new Error(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export async function createApiClient(): Promise<DefaiApiClient> {
  const config = await configManager.load();
  return new DefaiApiClient(config.apiUrl, config.apiKey);
} 