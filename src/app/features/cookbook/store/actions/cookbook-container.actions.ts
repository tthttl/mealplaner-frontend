import { createAction, props } from '@ngrx/store';
import { BasicShoppingListItem, Cookbook, Recipe } from '../../../../core/models/model';

export const loadCookbook = createAction('[Cookbook Container] Load Cookbooks');
export const createCookbook = createAction(
  '[Cookbook Container] Create Cookbooks',
  props<{ optimisticId: string, title: string }>()
);
export const editCookbook = createAction(
  '[Cookbook Container] Edit Cookbooks',
  props<{ cookbook: Cookbook }>()
);
export const deleteCookbook = createAction(
  '[Cookbook Container] Delete Cookbooks',
  props<{ cookbook: Cookbook }>()
);
export const deleteCookbookFromState = createAction(
  '[Cookbook Container] Delete Cookbooks From State',
  props<{ cookbook: Cookbook }>()
);

export const selectCookbook = createAction(
  '[Cookbook Container] Select Cookbook',
  props<{ selectedCookbookId: string }>()
);

export const loadRecipes = createAction('[Cookbook Container] Get Recipes');
export const createRecipe = createAction(
  '[Cookbook Container] Create Recipe',
  props<{ optimisticId: string, recipeToSave: Recipe }>()
);
export const editRecipe = createAction(
  '[Cookbook Container] Edit Recipe',
  props<{ recipeToEdit: Recipe }>()
);
export const deleteRecipe = createAction(
  '[Cookbook Container] Delete Recipe',
  props<{ recipe: Recipe }>()
);
export const deleteRecipeFromState = createAction('[Cookbook Container] Delete Recipe from State', props<{ recipeToDelete: Recipe }>());

export const copyIngredientsToShoppingList = createAction('[CookbookContainer]',
  props<{ optimisticId: string, shoppingListItem: BasicShoppingListItem }>());

export const copyRecipeToMealplaner = createAction('[CookbookContainer]',
  props<{ recipe: Recipe }>());

export const loadShoppingLists = createAction('[Cookbook Container] Load ShoppingLists from Cookbook Container');

