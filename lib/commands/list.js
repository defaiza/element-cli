"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCommand = listCommand;
const logger_1 = require("../utils/logger");
const logger = new logger_1.Logger();
async function listCommand(options) {
    try {
        logger.info('List command not yet implemented');
        logger.info('This would list published elements');
    }
    catch (error) {
        logger.error(`List error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
    }
}
//# sourceMappingURL=list.js.map