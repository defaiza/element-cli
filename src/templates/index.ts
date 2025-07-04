export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  dependencies: string[];
  devDependencies: string[];
  files: string[];
}

const templates: Record<string, Template> = {
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
  nextjs: {
    id: 'nextjs',
    name: 'Next.js Element',
    description: 'A Next.js-based element with App Router and SSR support',
    category: 'UI',
    dependencies: [
      'next',
      'react',
      'react-dom',
      '@types/react',
      '@types/react-dom',
      '@types/node'
    ],
    devDependencies: [
      'typescript',
      'eslint',
      'eslint-config-next'
    ],
    files: [
      'package.json',
      'tsconfig.json',
      'next.config.js',
      'manifest.json',
      'src/app/page.tsx',
      'src/app/layout.tsx',
      'src/components/Element.tsx',
      'src/styles/globals.css',
      'public/index.html',
      'README.md',
      '.gitignore'
    ]
  },
  svelte: {
    id: 'svelte',
    name: 'Svelte Element',
    description: 'A Svelte-based element with TypeScript support',
    category: 'UI',
    dependencies: [
      'svelte',
      '@sveltejs/kit'
    ],
    devDependencies: [
      '@types/node',
      'typescript',
      'svelte-check',
      'vite',
      '@sveltejs/vite-plugin-svelte'
    ],
    files: [
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      'svelte.config.js',
      'manifest.json',
      'src/routes/+page.svelte',
      'src/lib/Element.svelte',
      'src/app.html',
      'src/app.css',
      'README.md',
      '.gitignore'
    ]
  },
  solid: {
    id: 'solid',
    name: 'SolidJS Element',
    description: 'A SolidJS-based element with fine-grained reactivity',
    category: 'UI',
    dependencies: [
      'solid-js',
      'solid-router'
    ],
    devDependencies: [
      '@types/node',
      'typescript',
      'vite',
      'vite-plugin-solid'
    ],
    files: [
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      'manifest.json',
      'src/index.tsx',
      'src/App.tsx',
      'src/components/Element.tsx',
      'src/styles.css',
      'index.html',
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
      'README.md',
      '.gitignore'
    ]
  },
  'ai-ml': {
    id: 'ai-ml',
    name: 'AI/ML Element',
    description: 'An AI-powered element with TensorFlow.js integration',
    category: 'AI Tools',
    dependencies: [
      '@tensorflow/tfjs',
      'react',
      'react-dom'
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
      '@types/react',
      '@types/react-dom'
    ],
    files: [
      'package.json',
      'tsconfig.json',
      'webpack.config.js',
      'manifest.json',
      'src/index.tsx',
      'src/AIModel.tsx',
      'src/utils/tensorflow.ts',
      'src/styles.css',
      'public/index.html',
      'README.md',
      '.gitignore'
    ]
  },
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard Element',
    description: 'An admin dashboard element with data visualization',
    category: 'Analytics',
    dependencies: [
      'react',
      'react-dom',
      'recharts',
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
      '@types/react',
      '@types/react-dom'
    ],
    files: [
      'package.json',
      'tsconfig.json',
      'webpack.config.js',
      'manifest.json',
      'src/index.tsx',
      'src/components/Dashboard.tsx',
      'src/components/Widgets.tsx',
      'src/styles.css',
      'public/index.html',
      'README.md',
      '.gitignore'
    ]
  },
  ecommerce: {
    id: 'ecommerce',
    name: 'E-commerce Element',
    description: 'An e-commerce element with shopping cart and payment integration',
    category: 'Productivity',
    dependencies: [
      'react',
      'react-dom',
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
      '@types/react',
      '@types/react-dom'
    ],
    files: [
      'package.json',
      'tsconfig.json',
      'webpack.config.js',
      'manifest.json',
      'src/index.tsx',
      'src/components/Shop.tsx',
      'src/components/Cart.tsx',
      'src/styles.css',
      'public/index.html',
      'README.md',
      '.gitignore'
    ]
  },
  social: {
    id: 'social',
    name: 'Social Media Element',
    description: 'A social media element with feed and messaging',
    category: 'Information',
    dependencies: [
      'react',
      'react-dom',
      'axios',
      'socket.io-client'
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
      '@types/react',
      '@types/react-dom'
    ],
    files: [
      'package.json',
      'tsconfig.json',
      'webpack.config.js',
      'manifest.json',
      'src/index.tsx',
      'src/components/Feed.tsx',
      'src/components/Message.tsx',
      'src/styles.css',
      'public/index.html',
      'README.md',
      '.gitignore'
    ]
  },
  productivity: {
    id: 'productivity',
    name: 'Productivity Element',
    description: 'A productivity element with task management and calendar',
    category: 'Productivity',
    dependencies: [
      'react',
      'react-dom',
      'date-fns'
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
      '@types/react',
      '@types/react-dom'
    ],
    files: [
      'package.json',
      'tsconfig.json',
      'webpack.config.js',
      'manifest.json',
      'src/index.tsx',
      'src/components/TaskManager.tsx',
      'src/components/Calendar.tsx',
      'src/styles.css',
      'public/index.html',
      'README.md',
      '.gitignore'
    ]
  },
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment Element',
    description: 'An entertainment element with media player and content discovery',
    category: 'Games',
    dependencies: [
      'react',
      'react-dom',
      'howler'
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
      '@types/react',
      '@types/react-dom'
    ],
    files: [
      'package.json',
      'tsconfig.json',
      'webpack.config.js',
      'manifest.json',
      'src/index.tsx',
      'src/components/MediaPlayer.tsx',
      'src/components/Playlist.tsx',
      'src/styles.css',
      'public/index.html',
      'README.md',
      '.gitignore'
    ]
  }
};

/**
 * Get a template by ID
 */
export function getTemplate(id: string): Template | null {
  return templates[id] || null;
}

/**
 * Get all available templates
 */
export function getAllTemplates(): Template[] {
  return Object.values(templates);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): Template[] {
  return getAllTemplates().filter(template => template.category === category);
}

/**
 * Check if a template exists
 */
export function templateExists(id: string): boolean {
  return id in templates;
}

/**
 * Get template categories
 */
export function getTemplateCategories(): string[] {
  const categories = new Set(getAllTemplates().map(t => t.category));
  return Array.from(categories);
} 