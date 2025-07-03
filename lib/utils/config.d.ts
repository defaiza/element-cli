export interface CliConfig {
    apiKey?: string;
    apiUrl?: string;
    defaultTemplate?: string;
    analytics?: boolean;
    telemetry?: boolean;
}
export declare class ConfigManager {
    private explorer;
    load(): Promise<CliConfig>;
    save(config: Partial<CliConfig>): Promise<void>;
    get(key: keyof CliConfig): Promise<any>;
    set(key: keyof CliConfig, value: any): Promise<void>;
    reset(): Promise<void>;
}
export declare const configManager: ConfigManager;
//# sourceMappingURL=config.d.ts.map