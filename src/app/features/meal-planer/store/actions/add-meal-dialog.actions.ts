import { createAction, props } from '@ngrx/store';

export const loadCookbooks = createAction('[Add Meal Dialog] Load Cookbooks');

export const loadShoppingLists = createAction('[Add Meal Dialog] Load ShoppingLists');

export const loadRecipesForSelectedCookbook = createAction('[Add Meal Dialog] Load Recipes for Selected Cookbook', props<{ id: string }>());
