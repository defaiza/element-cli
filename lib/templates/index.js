"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplate = getTemplate;
exports.getAllTemplates = getAllTemplates;
exports.getTemplatesByCategory = getTemplatesByCategory;
exports.templateExists = templateExists;
exports.getTemplateCategories = getTemplateCategories;
const templates = {
    react: {
        id: 'react',
        name: 'React Element',
        description: 'A React-based element with TypeScript support',
        category: 'UI',
        dependencies: [
            'react',
            'react-dom',
            '@types/react',
            '@types/react-dom'
        ],
        devDependencies: [
            '@types/node',
            'typescript',
            'webpack',
            'webpack-cli',
            'webpack-dev-server',
            'html-webpack-plugin',
            'ts-loader',
            'css-loader',
            'style-loader'
        ],
        files: [
            'package.json',
            'tsconfig.json',
            'webpack.config.js',
            'manifest.json',
            'src/index.tsx',
            'src/styles.css',
            'public/index.html',
            'README.md',
            '.gitignore'
        ]
    },
    vue: {
        id: 'vue',
        name: 'Vue.js Element',
        description: 'A Vue.js-based element with TypeScript support',
        category: 'UI',
        dependencies: [
            'vue',
            '@vue/runtime-dom'
        ],
        devDependencies: [
            '@types/node',
            'typescript',
            'webpack',
            'webpack-cli',
            'webpack-dev-server',
            'html-webpack-plugin',
            'ts-loader',
            'css-loader',
            'style-loader',
            'vue-loader',
            '@vue/compiler-sfc'
        ],
        files: [
            'package.json',
            'tsconfig.json',
            'webpack.config.js',
            'manifest.json',
            'src/index.ts',
            'src/App.vue',
            'src/styles.css',
            'public/index.html',
            'README.md'
        ]
    },
    vanilla: {
        id: 'vanilla',
        name: 'Vanilla JavaScript Element',
        description: 'A vanilla JavaScript element with minimal dependencies',
        category: 'UI',
        dependencies: [],
        devDependencies: [
            'webpack',
            'webpack-cli',
            'webpack-dev-server',
            'html-webpack-plugin',
            'css-loader',
            'style-loader'
        ],
        files: [
            'package.json',
            'webpack.config.js',
            'manifest.json',
            'src/index.js',
            'src/styles.css',
            'public/index.html',
            'README.md',
            '.gitignore'
        ]
    },
    game: {
        id: 'game',
        name: 'Game Element',
        description: 'A game element with canvas and game loop',
        category: 'Games',
        dependencies: [],
        devDependencies: [
            '@types/node',
            'typescript',
            'webpack',
            'webpack-cli',
            'webpack-dev-server',
            'html-webpack-plugin',
            'ts-loader',
            'css-loader',
            'style-loader'
        ],
        files: [
            'package.json',
            'tsconfig.json',
            'webpack.config.js',
            'manifest.json',
            'src/index.ts',
            'src/game.ts',
            'src/styles.css',
            'public/index.html',
            'README.md'
        ]
    },
    chart: {
        id: 'chart',
        name: 'Chart Element',
        description: 'A data visualization element with charting library',
        category: 'Analytics',
        dependencies: [
            'chart.js',
            'react-chartjs-2'
        ],
        devDependencies: [
            '@types/node',
            'typescript',
            'webpack',
            'webpack-cli',
            'webpack-dev-server',
            'html-webpack-plugin',
            'ts-loader',
            'css-loader',
            'style-loader',
            'react',
            'react-dom',
            '@types/react',
            '@types/react-dom'
        ],
        files: [
            'package.json',
            'tsconfig.json',
            'webpack.config.js',
            'manifest.json',
            'src/index.tsx',
            'src/Chart.tsx',
            'src/styles.css',
            'public/index.html',
            'README.md'
        ]
    },
    trading: {
        id: 'trading',
        name: 'Trading Tools Element',
        description: 'A trading tools element with price feeds and charts',
        category: 'Trading',
        dependencies: [
            'chart.js',
            'react-chartjs-2',
            'axios'
        ],
        devDependencies: [
            '@types/node',
            'typescript',
            'webpack',
            'webpack-cli',
            'webpack-dev-server',
            'html-webpack-plugin',
            'ts-loader',
            'css-loader',
            'style-loader',
            'react',
            'react-dom',
            '@types/react',
            '@types/react-dom'
        ],
        files: [
            'package.json',
            'tsconfig.json',
            'webpack.config.js',
            'manifest.json',
            'src/index.tsx',
            'src/TradingView.tsx',
            'src/api.ts',
            'src/styles.css',
            'public/index.html',
            'README.md'
        ]
    }
};
/**
 * Get a template by ID
 */
function getTemplate(id) {
    return templates[id] || null;
}
/**
 * Get all available templates
 */
function getAllTemplates() {
    return Object.values(templates);
}
/**
 * Get templates by category
 */
function getTemplatesByCategory(category) {
    return getAllTemplates().filter(template => template.category === category);
}
/**
 * Check if a template exists
 */
function templateExists(id) {
    return id in templates;
}
/**
 * Get template categories
 */
function getTemplateCategories() {
    const categories = new Set(getAllTemplates().map(t => t.category));
    return Array.from(categories);
}
//# sourceMappingURL=index.js.map