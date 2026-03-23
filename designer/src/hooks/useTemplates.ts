import { useState, useEffect } from 'react';
import { Template } from '../types/template';

// Define types that match what the UI expects (hierarchical)
export interface TemplateData {
    id: string;
    name: string;
    thumbnail?: string;
    width: number;
    height: number;
    background: any;
    elements: any[];
    [key: string]: any;
}

export interface TemplateTheme {
    id: string;
    name: string;
    templates: TemplateData[];
}

export interface TemplateCategory {
    id: string;
    name: string;
    themes: TemplateTheme[];
}

export function useTemplatesHierarchy() {
    const [categories, setCategories] = useState<TemplateCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch our internal templates
                const response = await fetch('/api/templates');
                if (!response.ok) throw new Error('Failed to fetch templates');
                
                const data = await response.json();
                const templates: Template[] = data.templates || [];

                // Group templates into hierarchy: Category -> Subcategory(Theme) -> Template
                const categoryMap: Record<string, Record<string, TemplateData[]>> = {};

                templates.forEach(t => {
                    const catId = t.info.category || 'general';
                    const themeId = t.info.subcategory || 'standard';
                    const page = t.pages[0]; // Assuming primarily single page templates for now

                    // Map to expected UI format
                    const tmplData: TemplateData = {
                        id: t.info.id,
                        name: t.info.name,
                        thumbnail: t.info.thumbnail,
                        width: page?.width || 1080,
                        height: page?.height || 1080,
                        background: page?.background || { type: 'solid', color: '#ffffff' },
                        elements: page?.elements || [],
                    };

                    if (!categoryMap[catId]) categoryMap[catId] = {};
                    if (!categoryMap[catId][themeId]) categoryMap[catId][themeId] = [];
                    
                    categoryMap[catId][themeId].push(tmplData);
                });

                // Convert map to Array format expected by UI
                const hierarchy: TemplateCategory[] = Object.keys(categoryMap).map(catId => {
                    // Make nice names from IDs
                    const catName = catId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                    
                    const themes = Object.keys(categoryMap[catId]).map(themeId => {
                        const themeName = themeId.charAt(0).toUpperCase() + themeId.slice(1);
                        return {
                            id: themeId,
                            name: themeName,
                            templates: categoryMap[catId][themeId]
                        };
                    });

                    return {
                        id: catId,
                        name: catName,
                        themes
                    };
                });

                setCategories(hierarchy);

            } catch (err) {
                console.error("Failed to load templates:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { categories, loading, error };
}
