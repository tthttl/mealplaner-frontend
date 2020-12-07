import { createAction, props } from '@ngrx/store';
import { Recipe } from '../../../../core/models/model';

export const loadRecipe = createAction('[Recipe Container] Get Recipe', props<{ id: string }>());
export const createRecipe = createAction(
  '[Cookbook Container] Create Recipe',
  props<{ optimisticId: string, recipeToSave: Recipe }>()
);
export const editRecipe = createAction(
  '[Cookbook Container] Edit Recipe',
  props<{ recipeToEdit: Recipe }>()
);
