import { TemplateCategory, TemplateData } from '../types';
import foodRestaurantData from '../data/food_restaurant.json';

// Cast JSON data to TemplateData[]
const allFoodRestaurantTemplates = foodRestaurantData as TemplateData[];

// Filter templates by theme
export const foodBlogTemplates = allFoodRestaurantTemplates.filter(t => t.theme === 'foodblog');
export const menuTemplates = allFoodRestaurantTemplates.filter(t => t.theme === 'menu');

export const foodRestaurantCategory: TemplateCategory = {
    id: 'food-restaurant',
    name: 'Food & Restaurant',
    description: 'Menus, food blogs, and restaurant promotions',
    themes: [
        {
            id: 'foodblog',
            name: 'Food Blog',
            categoryId: 'food-restaurant',
            description: 'Social media graphics for food bloggers',
            templates: foodBlogTemplates,
        },
        {
            id: 'menu',
            name: 'Menu',
            categoryId: 'food-restaurant',
            description: 'Restaurant menus and drink lists',
            templates: menuTemplates,
        },
    ],
};
