"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCommand = buildCommand;
const webpack_1 = __importDefault(require("webpack"));
const ora_1 = __importDefault(require("ora"));
const logger_1 = require("../utils/logger");
const webpack_config_1 = require("../config/webpack.config");
const validators_1 = require("../utils/validators");
const logger = new logger_1.Logger();
async function buildCommand(options) {
    const spinner = (0, ora_1.default)();
    try {
        // Validate project
        const projectDir = process.cwd();
        const validation = await (0, validators_1.validateProject)(projectDir);
        if (!validation.valid) {
            logger.error('Invalid element project:');
            validation.errors.forEach(err => logger.error(`  • ${err}`));
            process.exit(1);
        }
        spinner.start('Building element...');
        // Get webpack configuration
        const webpackConfig = (0, webpack_config_1.getWebpackConfig)({
            mode: 'production',
            projectDir,
            analyze: options.analyze,
            sourceMaps: options.sourceMaps,
            minify: options.minify
        });
        // Create compiler
        const compiler = (0, webpack_1.default)(webpackConfig);
        // Run build
        compiler.run((err, stats) => {
            if (err) {
                spinner.fail('Build failed');
                logger.error(err.message);
                process.exit(1);
            }
            if (stats?.hasErrors()) {
                spinner.fail('Build failed');
                console.error(stats.toString({ colors: true }));
                process.exit(1);
            }
            spinner.succeed('Build completed successfully!');
            if (stats) {
                const info = stats.toJson();
                logger.info(`\nBuild output: ${options.output}`);
                logger.info(`Bundle size: ${(info.assets?.[0]?.size || 0) / 1024} KB`);
            }
        });
    }
    catch (error) {
        spinner.fail('Build failed');
        logger.error(error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    }
}
//# sourceMappingURL=build.js.map