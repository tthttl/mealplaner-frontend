import { createAction, props } from '@ngrx/store';
import { Recipe } from '../../shared/model/model';

export const loadRecipes = createAction('[Recipe Container] Get Recipes');
export const loadRecipesSuccess = createAction(
  '[Recipe Container] Get Recipes Success',
  props<{ recipes: Recipe[] }>()
);
export const loadRecipesFailure = createAction('[Recipe Container] Get Recipes Failure');


export const createRecipe = createAction(
  '[Cookbook Container] Create Recipe',
  props<{ recipeToSave: Recipe }>()
);
export const createRecipeSuccess = createAction(
  '[Cookbook Container] Create Recipe Success',
  props<{ savedRecipe: Recipe }>()
);
export const createRecipeFailure = createAction('[Cookbook Container] Create Recipe Failure');

export const editRecipe = createAction(
  '[Cookbook Container] Edit Recipe',
  props<{ recipeToEdit: Recipe }>()
);
export const editRecipeSuccess = createAction(
  '[Cookbook Container] Edit Recipe Success',
  props<{ editedRecipe: Recipe }>()
);
export const editRecipeFailure = createAction('[Cookbook Container] Edit Recipe Failure');
