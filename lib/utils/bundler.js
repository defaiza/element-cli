"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBundle = createBundle;
exports.validateBundle = validateBundle;
const archiver_1 = __importDefault(require("archiver"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("./logger");
const logger = new logger_1.Logger();
async function createBundle(options) {
    const { sourceDir, outputPath, exclude = [] } = options;
    // Ensure output directory exists
    await fs_extra_1.default.ensureDir(path_1.default.dirname(outputPath));
    return new Promise((resolve, reject) => {
        const output = fs_extra_1.default.createWriteStream(outputPath);
        const archive = (0, archiver_1.default)('zip', {
            zlib: { level: 9 } // Maximum compression
        });
        output.on('close', () => {
            const size = (archive.pointer() / 1024 / 1024).toFixed(2);
            logger.info(`Bundle created: ${outputPath} (${size} MB)`);
            resolve();
        });
        archive.on('error', (err) => {
            reject(new Error(`Bundle creation failed: ${err.message}`));
        });
        archive.pipe(output);
        // Add manifest
        const manifestPath = path_1.default.join(sourceDir, 'manifest.json');
        if (fs_extra_1.default.existsSync(manifestPath)) {
            archive.file(manifestPath, { name: 'manifest.json' });
        }
        // Add dist folder
        const distPath = path_1.default.join(sourceDir, 'dist');
        if (fs_extra_1.default.existsSync(distPath)) {
            archive.directory(distPath, 'dist');
        }
        // Add package.json (without devDependencies)
        const packageJsonPath = path_1.default.join(sourceDir, 'package.json');
        if (fs_extra_1.default.existsSync(packageJsonPath)) {
            const packageJson = fs_extra_1.default.readJsonSync(packageJsonPath);
            delete packageJson.devDependencies;
            archive.append(JSON.stringify(packageJson, null, 2), { name: 'package.json' });
        }
        // Add README
        const readmePath = path_1.default.join(sourceDir, 'README.md');
        if (fs_extra_1.default.existsSync(readmePath)) {
            archive.file(readmePath, { name: 'README.md' });
        }
        // Add LICENSE if exists
        const licensePath = path_1.default.join(sourceDir, 'LICENSE');
        if (fs_extra_1.default.existsSync(licensePath)) {
            archive.file(licensePath, { name: 'LICENSE' });
        }
        archive.finalize();
    });
}
async function validateBundle(bundlePath) {
    const errors = [];
    if (!fs_extra_1.default.existsSync(bundlePath)) {
        errors.push('Bundle file does not exist');
        return { valid: false, errors };
    }
    // Check file size
    const stats = await fs_extra_1.default.stat(bundlePath);
    const sizeMB = stats.size / 1024 / 1024;
    if (sizeMB > 50) {
        errors.push(`Bundle size (${sizeMB.toFixed(2)} MB) exceeds maximum allowed size (50 MB)`);
    }
    // TODO: Add more validation (extract and check contents)
    return {
        valid: errors.length === 0,
        errors
    };
}
//# sourceMappingURL=bundler.js.map