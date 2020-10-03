import { Action, createReducer, on } from '@ngrx/store';
import { Recipe } from '../../shared/model/model';
import { RecipeApiActions } from '../actions';
import { initialRecipeState, RecipeState } from '../state/recipe-state';

export const recipeStateReducer = createReducer<RecipeState, Action>(
  initialRecipeState,
  on(RecipeApiActions.loadRecipesSuccess, (
    state: RecipeState,
    {recipes}: { recipes: Recipe[] }) => ({...state, recipes}))
);
