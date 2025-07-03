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
export declare class DefaiApiClient {
    private client;
    constructor(apiUrl?: string, apiKey?: string);
    login(email: string, password: string): Promise<{
        token: string;
        user: any;
    }>;
    publish(options: PublishOptions): Promise<{
        elementId: string;
        url: string;
    }>;
    getStats(elementId?: string): Promise<ElementStats | ElementStats[]>;
    listElements(): Promise<any[]>;
    validateElement(manifestPath: string): Promise<{
        valid: boolean;
        errors: string[];
    }>;
}
export declare function createApiClient(): Promise<DefaiApiClient>;
//# sourceMappingURL=api.d.ts.map