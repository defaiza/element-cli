"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaiApiClient = void 0;
exports.createApiClient = createApiClient;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_1 = require("../utils/config");
class DefaiApiClient {
    constructor(apiUrl, apiKey) {
        this.client = axios_1.default.create({
            baseURL: apiUrl || 'https://api.defai.com',
            headers: {
                'Authorization': apiKey ? `Bearer ${apiKey}` : '',
                'Content-Type': 'application/json'
            }
        });
    }
    async login(email, password) {
        try {
            const response = await this.client.post('/auth/login', { email, password });
            return response.data;
        }
        catch (error) {
            throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async publish(options) {
        try {
            const form = new form_data_1.default();
            // Add element bundle
            const bundlePath = `${options.elementPath}/dist/element.zip`;
            if (!fs_extra_1.default.existsSync(bundlePath)) {
                throw new Error('Element bundle not found. Run "defai-element build" first.');
            }
            form.append('bundle', fs_extra_1.default.createReadStream(bundlePath));
            form.append('tier', options.tier);
            form.append('price', options.price.toString());
            form.append('royalty', options.royalty.toString());
            const response = await this.client.post('/elements/publish', form, {
                headers: form.getHeaders()
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Publish failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getStats(elementId) {
        try {
            const url = elementId ? `/elements/${elementId}/stats` : '/elements/stats';
            const response = await this.client.get(url);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to get stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async listElements() {
        try {
            const response = await this.client.get('/elements');
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to list elements: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async validateElement(manifestPath) {
        try {
            const manifest = await fs_extra_1.default.readJson(manifestPath);
            const response = await this.client.post('/elements/validate', { manifest });
            return response.data;
        }
        catch (error) {
            throw new Error(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.DefaiApiClient = DefaiApiClient;
async function createApiClient() {
    const config = await config_1.configManager.load();
    return new DefaiApiClient(config.apiUrl, config.apiKey);
}
//# sourceMappingURL=api.js.map