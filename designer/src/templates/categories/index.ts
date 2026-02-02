// Categories Registry - Simple imports from single category files

import { businessCategory } from './business';


import { festivalCategory } from './festival';
import { documentsCategory } from './documents';
import { marketingCategory } from './marketing';
import { presentationCategory } from './presentation';
import { ecommerceCategory } from './ecommerce';
import { healthcareCategory } from './healthcare';
import { sportsFitnessCategory } from './sports_fitness';
import { eventsCategory } from './events';
import { lifestyleCategory } from './lifestyle';
import { foodRestaurantCategory } from './food_restaurant';
import { technologyCategory } from './technology';
import { invitationCategory } from './invitation';

// Export all categories as an array
export const categories = [
    businessCategory,


    festivalCategory,
    documentsCategory,
    marketingCategory,
    presentationCategory,
    ecommerceCategory,
    healthcareCategory,
    sportsFitnessCategory,
    eventsCategory,
    lifestyleCategory,
    foodRestaurantCategory,
    technologyCategory,
    invitationCategory,
];

// Re-export individual categories
export { businessCategory } from './business';


export { festivalCategory } from './festival';
export { documentsCategory } from './documents';
export { marketingCategory } from './marketing';
export { presentationCategory } from './presentation';
export { ecommerceCategory } from './ecommerce';
export { healthcareCategory } from './healthcare';
export { sportsFitnessCategory } from './sports_fitness';
export { eventsCategory } from './events';
export { lifestyleCategory } from './lifestyle';
export { foodRestaurantCategory } from './food_restaurant';
export { technologyCategory } from './technology';
export { invitationCategory } from './invitation';
