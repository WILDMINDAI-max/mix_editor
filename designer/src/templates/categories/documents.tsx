import { TemplateCategory, TemplateData } from '../types';
import documentsData from '../data/documents.json';

// Cast JSON data to TemplateData[]
const allDocumentsTemplates = documentsData as TemplateData[];

// Filter templates by theme
export const resumeTemplates = allDocumentsTemplates.filter(t => t.theme === 'resume');
export const certificateTemplates = allDocumentsTemplates.filter(t => t.theme === 'certificate');
export const companyStationeryTemplates = allDocumentsTemplates.filter(t => t.theme === 'companystationery');

export const documentsCategory: TemplateCategory = {
    id: 'documents',
    name: 'Documents',
    description: 'Professional document templates',
    themes: [
        {
            id: 'resume',
            name: 'Resume',
            categoryId: 'documents',
            description: 'Professional resume and CV designs',
            templates: resumeTemplates,
        },
        {
            id: 'certificate',
            name: 'Certificate',
            categoryId: 'documents',
            description: 'Certificates of achievement and completion',
            templates: certificateTemplates,
        },
        {
            id: 'companystationery',
            name: 'Company Stationery',
            categoryId: 'documents',
            description: 'Professional letterheads and stationery',
            templates: companyStationeryTemplates,
        },
    ],
};
