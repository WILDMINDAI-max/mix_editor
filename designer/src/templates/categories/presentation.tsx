import { TemplateCategory, TemplateData } from '../types';
import presentationData from '../data/presentation.json';

// Cast JSON data to TemplateData[]
const allPresentationTemplates = presentationData as TemplateData[];

// Filter templates by theme
export const corporateTemplates = allPresentationTemplates.filter(t => t.theme === 'corporate');

export const presentationCategory: TemplateCategory = {
    id: 'presentation',
    name: 'Presentation',
    description: 'Professional presentation templates',
    themes: [
        {
            id: 'corporate',
            name: 'Corporate',
            categoryId: 'presentation',
            description: 'Corporate presentation decks',
            templates: corporateTemplates,
        },
    ],
};
