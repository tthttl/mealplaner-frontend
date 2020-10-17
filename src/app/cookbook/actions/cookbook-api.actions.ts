import { createAction, props } from '@ngrx/store';
import { Cookbook, Recipe } from '../../shared/model/model';

export const loadCookbookSuccess = createAction('[Cookbook Container] Load cookbooks success', props<{ cookbooks: Cookbook[] }>());
export const loadCookbookFailure = createAction('[Cookbook Container] Load cookbooks failure');
export const loadRecipesSuccess = createAction(
  '[LoadRecipe Effect] Get Recipes Success',
  props<{ cookbookId: string, recipes: Recipe[] }>()
);
export const loadRecipesFailure = createAction('[LoadRecipe Effect] Get Recipes Failure');
export const createRecipeSuccess = createAction(
  '[CreateRecipe Effect] Create Recipe Success',
  props<{ optimisticId: string, savedRecipe: Recipe }>()
);
export const createRecipeFailure = createAction('[CreateRecipe Effect] Create Recipe Failure',
  props<{ optimisticId: string, cookbookId: string }>());
export const editRecipeSuccess = createAction(
  '[EditRecipe Effect] Edit Recipe Success',
  props<{ editedRecipe: Recipe }>()
);
export const editRecipeFailure = createAction('[EditRecipe Effect] Edit Recipe Failure');
export const deleteRecipeSuccess = createAction(
  '[DeleteRecipe Effect] Delete Recipe Success',
  props<{ deletedRecipe: Recipe }>()
);
export const deleteRecipeFailure = createAction('[DeleteRecipe Effect] Delete Recipe Failure');
export const undoDeleteRecipeFromState = createAction('[DeleteRecipe Effect] Undo delete Recipe from State',
  props<{ recipe: Recipe }>());
