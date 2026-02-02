// Template System Main Index
// Production-level template registry with category > theme > template hierarchy

import { TemplateCategory, TemplateTheme, TemplateData, TemplateRegistry } from './types';
import { categories } from './categories';

// Export types
export * from './types';

// Export categories
export { categories } from './categories';

// Template Registry Implementation
export const templateRegistry: TemplateRegistry = {
    categories,

    getCategory(categoryId: string): TemplateCategory | undefined {
        return categories.find(c => c.id === categoryId);
    },

    getTheme(categoryId: string, themeId: string): TemplateTheme | undefined {
        const category = this.getCategory(categoryId);
        return category?.themes.find(t => t.id === themeId);
    },

    searchTemplates(query: string): TemplateData[] {
        const lowerQuery = query.toLowerCase();
        const results: TemplateData[] = [];

        for (const category of categories) {
            for (const theme of category.themes) {
                for (const template of theme.templates) {
                    if (
                        template.name.toLowerCase().includes(lowerQuery) ||
                        template.category.toLowerCase().includes(lowerQuery) ||
                        template.theme.toLowerCase().includes(lowerQuery) ||
                        template.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
                    ) {
                        results.push(template);
                    }
                }
            }
        }

        return results;
    },
};

// Helper: Get all templates flattened
export function getAllTemplates(): TemplateData[] {
    const templates: TemplateData[] = [];
    for (const category of categories) {
        for (const theme of category.themes) {
            templates.push(...theme.templates);
        }
    }
    return templates;
}

// Helper: Get total template count
export function getTemplateCount(): number {
    let count = 0;
    for (const category of categories) {
        for (const theme of category.themes) {
            count += theme.templates.length;
        }
    }
    return count;
}
