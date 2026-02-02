import { TemplateCategory, TemplateData } from '../types';
import lifestyleData from '../data/lifestyle.json';

// Cast JSON data to TemplateData[]
const allLifestyleTemplates = lifestyleData as TemplateData[];

// Filter templates by theme
export const motivationalQuoteTemplates = allLifestyleTemplates.filter(t => t.theme === 'motivationalquote');

export const lifestyleCategory: TemplateCategory = {
    id: 'lifestyle',
    name: 'Lifestyle',
    description: 'Lifestyle and motivational quotes',
    themes: [
        {
            id: 'motivationalquote',
            name: 'Motivational Quote',
            categoryId: 'lifestyle',
            description: 'Inspirational and motivational quote designs',
            templates: motivationalQuoteTemplates,
        },
    ],
};
