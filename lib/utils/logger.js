"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    /**
     * Log an info message
     */
    info(message) {
        console.log(chalk_1.default.blue('ℹ'), message);
    }
    /**
     * Log a success message
     */
    success(message) {
        console.log(chalk_1.default.green('✓'), message);
    }
    /**
     * Log a warning message
     */
    warn(message) {
        console.log(chalk_1.default.yellow('⚠'), message);
    }
    /**
     * Log an error message
     */
    error(message) {
        console.error(chalk_1.default.red('✗'), message);
    }
    /**
     * Log a debug message (only in debug mode)
     */
    debug(message) {
        if (process.env.DEBUG) {
            console.log(chalk_1.default.gray('🔍'), message);
        }
    }
    /**
     * Log a step in a process
     */
    step(message) {
        console.log(chalk_1.default.cyan('→'), message);
    }
    /**
     * Log a table
     */
    table(data) {
        console.table(data);
    }
    /**
     * Clear the console
     */
    clear() {
        console.clear();
    }
    /**
     * Log a separator line
     */
    separator() {
        console.log(chalk_1.default.gray('─'.repeat(50)));
    }
    /**
     * Log a header
     */
    header(title) {
        console.log('\n' + chalk_1.default.bold.cyan(title));
        console.log(chalk_1.default.gray('─'.repeat(title.length)));
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map