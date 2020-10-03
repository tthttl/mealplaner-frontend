import { createAction, props } from '@ngrx/store';
import { Recipe } from '../../shared/model/model';

export const loadRecipes = createAction('[Recipe Container] Get Recipes');
export const loadRecipesSuccess = createAction(
  '[Recipe Container] Get Recipes Success',
  props<{ recipes: Recipe[] }>()
);
export const loadRecipesFailure = createAction('[Recipe Container] Get Recipes Failure');
