// Template System Types
// Production-level type definitions for category > theme > template hierarchy

import { CanvasElement } from '@/types/canvas';
import { PageBackground } from '@/types/project';
import { ReactNode } from 'react';

// Template data structure
export interface TemplateData {
    id: string;
    name: string;
    category: string;
    theme: string;
    thumbnail?: string;
    width: number;
    height: number;
    background: PageBackground;
    elements: Partial<CanvasElement>[];
    tags?: string[];
    isPremium?: boolean;
}

// Theme structure - groups related templates
export interface TemplateTheme {
    id: string;
    name: string;
    categoryId: string;
    description?: string;
    templates: TemplateData[];
}

// Category structure - groups related themes
export interface TemplateCategory {
    id: string;
    name: string;
    icon?: string;
    description?: string;
    themes: TemplateTheme[];
}

// Preview component props
export interface TemplatePreviewProps {
    template: TemplateData;
    onClick?: () => void;
}

// Registry for lazy loading
export interface TemplateRegistry {
    categories: TemplateCategory[];
    getCategory: (categoryId: string) => TemplateCategory | undefined;
    getTheme: (categoryId: string, themeId: string) => TemplateTheme | undefined;
    searchTemplates: (query: string) => TemplateData[];
}
