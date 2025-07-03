export interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
    dependencies: string[];
    devDependencies: string[];
    files: string[];
}
/**
 * Get a template by ID
 */
export declare function getTemplate(id: string): Template | null;
/**
 * Get all available templates
 */
export declare function getAllTemplates(): Template[];
/**
 * Get templates by category
 */
export declare function getTemplatesByCategory(category: string): Template[];
/**
 * Check if a template exists
 */
export declare function templateExists(id: string): boolean;
/**
 * Get template categories
 */
export declare function getTemplateCategories(): string[];
//# sourceMappingURL=index.d.ts.map