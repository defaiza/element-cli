export declare class Logger {
    /**
     * Log an info message
     */
    info(message: string): void;
    /**
     * Log a success message
     */
    success(message: string): void;
    /**
     * Log a warning message
     */
    warn(message: string): void;
    /**
     * Log an error message
     */
    error(message: string): void;
    /**
     * Log a debug message (only in debug mode)
     */
    debug(message: string): void;
    /**
     * Log a step in a process
     */
    step(message: string): void;
    /**
     * Log a table
     */
    table(data: any[]): void;
    /**
     * Clear the console
     */
    clear(): void;
    /**
     * Log a separator line
     */
    separator(): void;
    /**
     * Log a header
     */
    header(title: string): void;
}
//# sourceMappingURL=logger.d.ts.map