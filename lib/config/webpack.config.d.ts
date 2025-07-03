import webpack from 'webpack';
interface WebpackConfigOptions {
    mode: 'development' | 'production';
    projectDir: string;
    hot?: boolean;
    port?: number;
    analyze?: boolean;
    sourceMaps?: boolean;
    minify?: boolean;
}
export declare function getWebpackConfig(options: WebpackConfigOptions): webpack.Configuration;
export {};
//# sourceMappingURL=webpack.config.d.ts.map