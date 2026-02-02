import { TemplateCategory, TemplateData } from '../types';
import healthcareData from '../data/healthcare.json';

// Cast JSON data to TemplateData[]
const allHealthcareTemplates = healthcareData as TemplateData[];

// Filter templates by theme
export const healthcareProfessionalTemplates = allHealthcareTemplates.filter(t => t.theme === 'healthcareprofessional');

export const healthcareCategory: TemplateCategory = {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Medical and healthcare templates',
    themes: [
        {
            id: 'healthcareprofessional',
            name: 'Healthcare Professional',
            categoryId: 'healthcare',
            description: 'Profiles and designs for healthcare professionals',
            templates: healthcareProfessionalTemplates,
        },
    ],
};
