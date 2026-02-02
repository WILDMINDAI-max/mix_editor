// Business Category - Data from JSON
import { TemplateCategory, TemplateData } from '../types';
import businessData from '../data/business.json';

// Cast JSON data to TemplateData[]
const allBusinessTemplates = businessData as TemplateData[];

// Filter templates by theme
export const businessCardTemplates = allBusinessTemplates.filter(t => t.theme === 'businesscard');

export const priceListTemplates = allBusinessTemplates.filter(t => t.theme === 'pricelist');











export const businessCategory: TemplateCategory = {
    id: 'business',
    name: 'Business',
    description: 'Professional business templates',
    themes: [
        {
            id: 'businesscard',
            name: 'Business Card',
            categoryId: 'business',
            description: 'Professional business card designs',
            templates: businessCardTemplates,
        },


        {
            id: 'pricelist',
            name: 'Price List',
            categoryId: 'business',
            description: 'Professional price list templates',
            templates: priceListTemplates,
        },









    ],
};

