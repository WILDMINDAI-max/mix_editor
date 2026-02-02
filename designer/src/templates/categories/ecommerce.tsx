import { TemplateCategory, TemplateData } from '../types';
import ecommerceData from '../data/ecommerce.json';

// Cast JSON data to TemplateData[]
const allEcommerceTemplates = ecommerceData as TemplateData[];

// Filter templates by theme
export const saleTemplates = allEcommerceTemplates.filter(t => t.theme === 'sale');

export const ecommerceCategory: TemplateCategory = {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'E-commerce and sale templates',
    themes: [
        {
            id: 'sale',
            name: 'Sale',
            categoryId: 'ecommerce',
            description: 'Sale and discount announcements',
            templates: saleTemplates,
        },
    ],
};
