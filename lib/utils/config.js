"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configManager = exports.ConfigManager = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const cosmiconfig_1 = require("cosmiconfig");
const CONFIG_NAME = 'defai-element';
const CONFIG_DIR = path_1.default.join(os_1.default.homedir(), '.defai');
const CONFIG_FILE = path_1.default.join(CONFIG_DIR, 'config.json');
const defaultConfig = {
    apiUrl: 'https://api.defai.com',
    defaultTemplate: 'react',
    analytics: true,
    telemetry: true
};
class ConfigManager {
    constructor() {
        this.explorer = (0, cosmiconfig_1.cosmiconfig)(CONFIG_NAME);
    }
    async load() {
        try {
            // Try to load from cosmiconfig first (looks for .defai-elementrc, etc.)
            const result = await this.explorer.search();
            if (result) {
                return { ...defaultConfig, ...result.config };
            }
            // Fall back to config file
            if (fs_extra_1.default.existsSync(CONFIG_FILE)) {
                const config = await fs_extra_1.default.readJson(CONFIG_FILE);
                return { ...defaultConfig, ...config };
            }
            return defaultConfig;
        }
        catch (error) {
            return defaultConfig;
        }
    }
    async save(config) {
        try {
            await fs_extra_1.default.ensureDir(CONFIG_DIR);
            const currentConfig = await this.load();
            const newConfig = { ...currentConfig, ...config };
            await fs_extra_1.default.writeJson(CONFIG_FILE, newConfig, { spaces: 2 });
        }
        catch (error) {
            throw new Error(`Failed to save config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async get(key) {
        const config = await this.load();
        return config[key];
    }
    async set(key, value) {
        await this.save({ [key]: value });
    }
    async reset() {
        try {
            if (fs_extra_1.default.existsSync(CONFIG_FILE)) {
                await fs_extra_1.default.remove(CONFIG_FILE);
            }
        }
        catch (error) {
            throw new Error(`Failed to reset config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.ConfigManager = ConfigManager;
exports.configManager = new ConfigManager();
//# sourceMappingURL=config.js.map