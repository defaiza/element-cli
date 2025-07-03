"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCommand = validateCommand;
const logger_1 = require("../utils/logger");
const validators_1 = require("../utils/validators");
const logger = new logger_1.Logger();
async function validateCommand(options) {
    try {
        const projectDir = process.cwd();
        const validation = await (0, validators_1.validateProject)(projectDir);
        if (validation.valid) {
            logger.success('Element validation passed!');
        }
        else {
            logger.error('Element validation failed:');
            validation.errors.forEach(err => logger.error(`  • ${err}`));
            process.exit(1);
        }
    }
    catch (error) {
        logger.error(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
    }
}
//# sourceMappingURL=validate.js.map