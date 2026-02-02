// Festival Category - All themes and templates in one file
// Themes: Diwali

import React from 'react';
import { TemplateCategory, TemplateData, TemplatePreviewProps } from '../types';
import festivalData from '../data/festival.json';

// ============================================
// DIWALI THEME
// ============================================

// Cast JSON data to TemplateData[]
const allFestivalTemplates = festivalData as TemplateData[];

export const diwaliTemplates: TemplateData[] = allFestivalTemplates.filter(t => t.theme === 'diwali');

// Diwali Preview Component
export const DiwaliPreview: React.FC<TemplatePreviewProps> = ({ template }) => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100">
        <span className="text-gray-400 text-sm">{template.name}</span>
    </div>
);

// ============================================
// CATEGORY EXPORT
// ============================================

export const festivalCategory: TemplateCategory = {
    id: 'festival',
    name: 'Festival',
    description: 'Festival and holiday templates',
    themes: [
        {
            id: 'diwali',
            name: 'Diwali',
            categoryId: 'festival',
            description: 'Diwali festival celebration templates',
            templates: diwaliTemplates,
        },
    ],
};

// Preview registry for this category
export const festivalPreviews: Record<string, React.FC<TemplatePreviewProps>> = {};

// Get preview for a template in this category
export const getFestivalPreview = (template: TemplateData): React.FC<TemplatePreviewProps> => {
    return festivalPreviews[template.id] || DiwaliPreview;
};
