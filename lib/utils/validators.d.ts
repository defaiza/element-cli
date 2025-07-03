/**
 * Validates an element name
 * @param name - The element name to validate
 * @returns true if valid, false otherwise
 */
export declare function validateElementName(name: string): boolean;
/**
 * Validates a project directory structure
 * @param projectDir - The project directory to validate
 * @returns Validation result with errors array
 */
export declare function validateProject(projectDir: string): Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Validates element permissions
 * @param permissions - Permissions object to validate
 * @returns true if valid, false otherwise
 */
export declare function validatePermissions(permissions: Record<string, boolean>): boolean;
/**
 * Validates element size constraints
 * @param size - Size object to validate
 * @returns true if valid, false otherwise
 */
export declare function validateSize(size: {
    width: number;
    height: number;
}): boolean;
//# sourceMappingURL=validators.d.ts.map