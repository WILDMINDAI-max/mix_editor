import { TemplateCategory, TemplateData } from '../types';
import eventsData from '../data/events.json';

// Cast JSON data to TemplateData[]
const allEventsTemplates = eventsData as TemplateData[];

// Filter templates by theme
export const publicEventTemplates = allEventsTemplates.filter(t => t.theme === 'publicevent');
export const techTemplates = allEventsTemplates.filter(t => t.theme === 'tech');

export const eventsCategory: TemplateCategory = {
    id: 'events',
    name: 'Events',
    description: 'Event flyers, posters, and exhibitions',
    themes: [
        {
            id: 'publicevent',
            name: 'Public Event',
            categoryId: 'events',
            description: 'Public event announcements and exhibitions',
            templates: publicEventTemplates,
        },
        {
            id: 'tech',
            name: 'Tech',
            categoryId: 'events',
            description: 'Technology conferences and event posters',
            templates: techTemplates,
        },
    ],
};
