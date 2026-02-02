import { TemplateCategory, TemplateData } from '../types';
import sportsFitnessData from '../data/sports_fitness.json';

// Cast JSON data to TemplateData[]
const allSportsFitnessTemplates = sportsFitnessData as TemplateData[];

// Filter templates by theme
export const gymPosterTemplates = allSportsFitnessTemplates.filter(t => t.theme === 'gymposter');

export const sportsFitnessCategory: TemplateCategory = {
    id: 'sports-fitness',
    name: 'Sports & Fitness',
    description: 'Sports, gym, and fitness templates',
    themes: [
        {
            id: 'gymposter',
            name: 'Gym Poster',
            categoryId: 'sports-fitness',
            description: 'Gym and fitness promotional posters',
            templates: gymPosterTemplates,
        },
    ],
};
