interface PublishOptions {
    tier: string;
    price: string;
    royalty: string;
    dryRun: boolean;
    skipValidation: boolean;
}
export declare function publishCommand(options: PublishOptions): Promise<void>;
export {};
//# sourceMappingURL=publish.d.ts.map