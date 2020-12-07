import { createAction, props } from '@ngrx/store';
import { Recipe } from '../../../../core/models/model';

export const loadRecipeSuccess = createAction('[Recipe Api] Load Recipe Success', props<{recipe: Recipe}>());
export const loadRecipeFailure = createAction('[Recipe Api] Load Recipe Failure');
export const createRecipeSuccess = createAction(
  '[CreateRecipe Effect] Create Recipe Success',
  props<{ optimisticId: string, recipe: Recipe }>()
);
export const createRecipeFailure = createAction('[CreateRecipe Effect] Create Recipe Failure',
  props<{ optimisticId: string, cookbookId: string }>());
export const editRecipeSuccess = createAction(
  '[EditRecipe Effect] Edit Recipe Success',
  props<{ recipe: Recipe }>()
);
export const editRecipeFailure = createAction('[EditRecipe Effect] Edit Recipe Failure');
