import { TemplateCategory, TemplateData } from '../types';
import invitationData from '../data/invitation.json';

// Cast JSON data to TemplateData[]
const allInvitationTemplates = invitationData as TemplateData[];

// Filter templates by theme
export const weddingTemplates = allInvitationTemplates.filter(t => t.theme === 'wedding');
export const birthdayTemplates = allInvitationTemplates.filter(t => t.theme === 'birthday');

export const invitationCategory: TemplateCategory = {
    id: 'invitation',
    name: 'Invitation',
    description: 'Wedding and event invitations',
    themes: [
        {
            id: 'wedding',
            name: 'Wedding',
            categoryId: 'invitation',
            description: 'Elegant wedding invitations',
            templates: weddingTemplates,
        },
        {
            id: 'birthday',
            name: 'Birthday',
            categoryId: 'invitation',
            description: 'Birthday party invitations',
            templates: birthdayTemplates,
        },
    ],
};
