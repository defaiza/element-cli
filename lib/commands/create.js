"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommand = createCommand;
const inquirer_1 = __importDefault(require("inquirer"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const ora_1 = __importDefault(require("ora"));
const child_process_1 = require("child_process");
const logger_1 = require("../utils/logger");
const validators_1 = require("../utils/validators");
const templates_1 = require("../templates");
const logger = new logger_1.Logger();
async function createCommand(name, options) {
    const spinner = (0, ora_1.default)();
    try {
        // Validate element name
        if (!(0, validators_1.validateElementName)(name)) {
            logger.error('Invalid element name. Use lowercase letters, numbers, and hyphens only.');
            process.exit(1);
        }
        // Determine project directory
        const projectDir = path_1.default.resolve(options.directory || name);
        // Check if directory exists
        if (fs_extra_1.default.existsSync(projectDir)) {
            const { overwrite } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: `Directory ${projectDir} already exists. Overwrite?`,
                    default: false
                }
            ]);
            if (!overwrite) {
                logger.info('Creation cancelled.');
                return;
            }
            fs_extra_1.default.removeSync(projectDir);
        }
        // Gather additional information
        const answers = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'displayName',
                message: 'Element display name:',
                default: name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
            },
            {
                type: 'input',
                name: 'description',
                message: 'Element description:',
                default: 'A DEFAI element'
            },
            {
                type: 'input',
                name: 'author',
                message: 'Author name:',
                default: process.env.USER || 'Anonymous'
            },
            {
                type: 'list',
                name: 'category',
                message: 'Element category:',
                choices: [
                    'Trading',
                    'Analytics',
                    'DEFAI',
                    'Productivity',
                    'AI Tools',
                    'Information',
                    'Utilities',
                    'Games',
                    'Developer Tools'
                ]
            },
            {
                type: 'list',
                name: 'tier',
                message: 'Minimum user tier required:',
                choices: [
                    { name: 'Free - Available to all users', value: 'free' },
                    { name: 'Bronze - Requires Bronze tier ($50+ DEFAI)', value: 'bronze' },
                    { name: 'Silver - Requires Silver tier ($500+ DEFAI)', value: 'silver' },
                    { name: 'Gold - Requires Gold tier ($5,000+ DEFAI)', value: 'gold' },
                    { name: 'Titanium - Requires Titanium tier ($50,000+ DEFAI)', value: 'titanium' }
                ]
            },
            {
                type: 'number',
                name: 'price',
                message: 'Element price in DEFAI tokens (0 for free):',
                default: 0,
                validate: (value) => value >= 0 || 'Price must be non-negative'
            }
        ]);
        spinner.start('Creating element project...');
        // Create project directory
        fs_extra_1.default.ensureDirSync(projectDir);
        // Get template
        const template = (0, templates_1.getTemplate)(options.template);
        if (!template) {
            spinner.fail(`Template "${options.template}" not found`);
            process.exit(1);
        }
        // Copy template files
        const templateDir = path_1.default.join(__dirname, '../../templates', options.template);
        fs_extra_1.default.copySync(templateDir, projectDir);
        // Update package.json
        const packageJsonPath = path_1.default.join(projectDir, 'package.json');
        const packageJson = fs_extra_1.default.readJsonSync(packageJsonPath);
        packageJson.name = `@defai-element/${name}`;
        packageJson.description = answers.description;
        packageJson.author = answers.author;
        packageJson.defaiElement = {
            id: name,
            displayName: answers.displayName,
            category: answers.category,
            tier: answers.tier,
            price: answers.price
        };
        fs_extra_1.default.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
        // Update manifest.json
        const manifestPath = path_1.default.join(projectDir, 'manifest.json');
        const manifest = fs_extra_1.default.readJsonSync(manifestPath);
        manifest.id = name;
        manifest.name = answers.displayName;
        manifest.description = answers.description;
        manifest.author = answers.author;
        manifest.category = answers.category;
        manifest.tierRequired = answers.tier;
        manifest.price = answers.price;
        fs_extra_1.default.writeJsonSync(manifestPath, manifest, { spaces: 2 });
        // Update element source file
        const srcFile = options.typescript ? 'src/index.tsx' : 'src/index.jsx';
        const srcPath = path_1.default.join(projectDir, srcFile);
        let srcContent = fs_extra_1.default.readFileSync(srcPath, 'utf-8');
        srcContent = srcContent
            .replace(/element-id/g, name)
            .replace(/Element Name/g, answers.displayName)
            .replace(/Element description/g, answers.description)
            .replace(/Your Name/g, answers.author)
            .replace(/'Utilities'/g, `'${answers.category}'`)
            .replace(/'free'/g, `'${answers.tier}'`);
        fs_extra_1.default.writeFileSync(srcPath, srcContent);
        spinner.succeed('Element project created!');
        // Install dependencies
        const { installDeps } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'installDeps',
                message: 'Install dependencies now?',
                default: true
            }
        ]);
        if (installDeps) {
            spinner.start('Installing dependencies...');
            try {
                (0, child_process_1.execSync)('npm install', {
                    cwd: projectDir,
                    stdio: 'pipe'
                });
                spinner.succeed('Dependencies installed!');
            }
            catch (error) {
                spinner.fail('Failed to install dependencies');
                logger.warn('You can install them manually by running "npm install"');
            }
        }
        // Success message
        logger.success(`\nElement "${answers.displayName}" created successfully!`);
        logger.info('\nNext steps:');
        logger.info(`  cd ${path_1.default.relative(process.cwd(), projectDir)}`);
        if (!installDeps) {
            logger.info('  npm install');
        }
        logger.info('  defai-element dev');
        logger.info('\nHappy coding! 🚀');
    }
    catch (error) {
        spinner.fail('Failed to create element');
        logger.error(error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    }
}
//# sourceMappingURL=create.js.map