import { TemplateCategory, TemplateData } from '../types';
import marketingData from '../data/marketing.json';

// Cast JSON data to TemplateData[]
const allMarketingTemplates = marketingData as TemplateData[];

// Filter templates by theme
export const pricingTableTemplates = allMarketingTemplates.filter(t => t.theme === 'pricingtable');

export const marketingCategory: TemplateCategory = {
    id: 'marketing',
    name: 'Marketing',
    description: 'Marketing materials and pricing tables',
    themes: [
        {
            id: 'pricingtable',
            name: 'Pricing Table',
            categoryId: 'marketing',
            description: 'Pricing tables and comparison charts',
            templates: pricingTableTemplates,
        },
    ],
};
