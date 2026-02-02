import { TemplateCategory, TemplateData } from '../types';
import technologyData from '../data/technology.json';

// Cast JSON data to TemplateData[]
const allTechnologyTemplates = technologyData as TemplateData[];

// Filter templates by theme
export const corporateBrandingTemplates = allTechnologyTemplates.filter(t => t.theme === 'corporatebranding');

export const technologyCategory: TemplateCategory = {
    id: 'technology',
    name: 'Technology',
    description: 'Tech startups, branding, and innovation',
    themes: [
        {
            id: 'corporatebranding',
            name: 'Corporate Branding',
            categoryId: 'technology',
            description: 'Logos and brand identity packages',
            templates: corporateBrandingTemplates,
        },
    ],
};
