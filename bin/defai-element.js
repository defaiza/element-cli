#!/usr/bin/env node

/**
 * DEFAI Element CLI
 * Command-line interface for developing and publishing DEFAI elements
 */

// Check Node version
const semver = require('semver');
const { engines } = require('../package.json');

if (!semver.satisfies(process.version, engines.node)) {
  console.error(
    `Required Node.js version ${engines.node} not satisfied with current version ${process.version}.`
  );
  process.exit(1);
}

// Check for updates
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
updateNotifier({ pkg }).notify();

// Load environment variables
require('dotenv').config();

// Run the CLI
try {
  require('../lib/cli');
} catch (error) {
  console.error('Failed to load CLI:', error.message);
  console.error('Make sure to run "npm run build" first');
  process.exit(1);
}