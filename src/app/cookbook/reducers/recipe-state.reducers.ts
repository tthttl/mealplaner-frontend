import { Action, createReducer, on } from '@ngrx/store';
import { Recipe } from '../../shared/model/model';
import { RecipeApiActions, RecipeStateActions } from '../actions';
import { initialRecipeState, RecipeState } from '../state/recipe-state';

export const recipeStateReducer = createReducer<RecipeState, Action>(
  initialRecipeState,
  on(RecipeApiActions.loadRecipesSuccess, (state: RecipeState, {recipes}: { recipes: Recipe[] }) => {
    return {
      ...state,
      recipes
    };
  }),
  on(RecipeApiActions.createRecipeSuccess, (state: RecipeState, {savedRecipe}: { savedRecipe: Recipe }) => {
    return {
      ...state,
      recipes: [
        ...state.recipes,
        savedRecipe
      ]
    };
  }),
  on(RecipeApiActions.editRecipeSuccess, (state: RecipeState, {editedRecipe}: { editedRecipe: Recipe }) => {
    return {
      ...state,
      recipes: [
        ...state.recipes.filter((item: Recipe) => item.id !== editedRecipe.id),
        editedRecipe
      ]
    };
  }),
  on(RecipeStateActions.deleteRecipeFromState, (state: RecipeState, {recipeId}: { recipeId: string }) => {
    return {
      ...state,
      recipes: state.recipes.filter(item => item.id !== recipeId)
    };
  })
);
