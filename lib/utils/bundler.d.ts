export interface BundleOptions {
    sourceDir: string;
    outputPath: string;
    exclude?: string[];
}
export declare function createBundle(options: BundleOptions): Promise<void>;
export declare function validateBundle(bundlePath: string): Promise<{
    valid: boolean;
    errors: string[];
}>;
//# sourceMappingURL=bundler.d.ts.map