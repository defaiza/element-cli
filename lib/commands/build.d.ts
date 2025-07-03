interface BuildOptions {
    output: string;
    analyze: boolean;
    sourceMaps: boolean;
    minify: boolean;
}
export declare function buildCommand(options: BuildOptions): Promise<void>;
export {};
//# sourceMappingURL=build.d.ts.map