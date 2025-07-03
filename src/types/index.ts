// DEFAI Element Types

export interface ElementManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: ElementCategory;
  tierRequired: TierLevel;
  price: number;
  defaultSize: Size;
  minSize: Size;
  maxSize: Size;
  permissions: Permissions;
  entryPoint: string;
  buildOutput: string;
}

export interface Size {
  width: number;
  height: number;
}

export interface Permissions {
  wallet: boolean;
  network: boolean;
  storage: boolean;
  notifications: boolean;
  camera: boolean;
  microphone: boolean;
  location: boolean;
  clipboard: boolean;
}

export type ElementCategory = 
  | 'Trading'
  | 'Analytics'
  | 'DEFAI'
  | 'Productivity'
  | 'AI Tools'
  | 'Information'
  | 'Utilities'
  | 'Games'
  | 'Developer Tools';

export type TierLevel = 'free' | 'bronze' | 'silver' | 'gold' | 'titanium';

export interface ElementConfig {
  id: string;
  displayName: string;
  category: ElementCategory;
  tier: TierLevel;
  price: number;
}

export interface WalletAPI {
  connected: boolean;
  address: string;
  balance: number;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  signMessage(message: string): Promise<string>;
  sendTransaction(tx: any): Promise<string>;
}

export interface StorageAPI {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface NotificationAPI {
  show(title: string, options?: { body?: string; icon?: string; badge?: string }): Promise<void>;
  requestPermission(): Promise<'granted' | 'denied' | 'default'>;
}

export interface DefaiElementAPI {
  wallet: WalletAPI;
  storage: StorageAPI;
  notifications: NotificationAPI;
  theme: 'light' | 'dark';
  size: Size;
  onThemeChange(callback: (theme: 'light' | 'dark') => void): void;
  onSizeChange(callback: (size: Size) => void): void;
} 