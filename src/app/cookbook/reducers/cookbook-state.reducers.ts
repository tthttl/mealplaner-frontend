import { Action, createReducer, on } from '@ngrx/store';
import { sortAlphabetically } from '../../shared/helpers/helpers';
import {
  Cookbook,
  CreateRecipeAction,
  CreateRecipeSuccessAction,
  CreateRecipeSuccessFailureAction,
  DeleteRecipeFromStateAction,
  EditRecipeSuccessAction,
  LoadRecipeSuccessAction,
  Recipe,
  UndoDeleteRecipeFromStateAction
} from '../../shared/model/model';
import { CookbookActions, CookbookApiActions } from '../actions';
import { CookbookState, initialCookbookState } from '../state/cookbook-state';

export const cookbookStateReducer = createReducer<CookbookState, Action>(
  initialCookbookState,
  on(CookbookApiActions.loadCookbookSuccess,
    (state: CookbookState, {cookbooks}: { cookbooks: Cookbook[] }) => ({
      ...state,
      activeCookbookId: cookbooks[0].id,
      cookbooks
    })
  ),
  on(CookbookApiActions.loadRecipesSuccess, (state: CookbookState, {cookbookId, recipes}: LoadRecipeSuccessAction) => {
    return {
      ...state,
      recipes: {
        ...state.recipes,
        [cookbookId]: recipes.slice().sort((a: Recipe, b: Recipe) => sortAlphabetically(a.title, b.title))
      }
    };
  }),
  on(CookbookActions.createRecipe, (state: CookbookState, {optimisticId, recipeToSave}: CreateRecipeAction) => {
    return {
      ...state,
      recipes: {
        ...state.recipes,
        [recipeToSave.cookbookId]: [...state.recipes[recipeToSave.cookbookId], {...recipeToSave, id: optimisticId}]
          .sort((a: Recipe, b: Recipe) => sortAlphabetically(a.title, b.title))
      }
    };
  }),
  on(CookbookApiActions.createRecipeSuccess, (state: CookbookState, {optimisticId, savedRecipe}: CreateRecipeSuccessAction) => {
    return {
      ...state,
      recipes: {
        ...state.recipes,
        [savedRecipe.cookbookId]: state.recipes[savedRecipe.cookbookId].map((recipe: Recipe) => {
          if (recipe.id === optimisticId) {
            return savedRecipe;
          } else {
            return recipe;
          }
        })
      }
    };
  }),
  on(CookbookApiActions.createRecipeFailure, (state: CookbookState, {optimisticId, cookbookId}: CreateRecipeSuccessFailureAction) => {
    return {
      ...state,
      recipes: {
        ...state.recipes,
        [cookbookId]: state.recipes[cookbookId].filter((recipe: Recipe) => recipe.id !== optimisticId)
      }
    };
  }),
  on(CookbookApiActions.editRecipeSuccess, (state: CookbookState, {editedRecipe}: EditRecipeSuccessAction) => {
    return {
      ...state,
      recipes: {
        ...state.recipes,
        [editedRecipe.cookbookId]: state.recipes[editedRecipe.cookbookId].map((item: Recipe) => {
          if (item.id === editedRecipe.id) {
            return editedRecipe;
          } else {
            return item;
          }
        }).sort((a: Recipe, b: Recipe) => sortAlphabetically(a.title, b.title))
      }
    };
  }),
  on(CookbookActions.deleteRecipeFromState, (state: CookbookState, {recipeToDelete}: DeleteRecipeFromStateAction) => {
    return {
      ...state,
      recipes: {
        ...state.recipes,
        [recipeToDelete.cookbookId]: state.recipes[recipeToDelete.cookbookId].filter((recipe: Recipe) => recipe.id !== recipeToDelete.id)
      }
    };
  }),
  on(CookbookApiActions.undoDeleteRecipeFromState, (state: CookbookState, {recipe}: UndoDeleteRecipeFromStateAction) => {
    return {
      ...state,
      recipes: {
        ...state.recipes,
        [recipe.cookbookId]: [...state.recipes[recipe.cookbookId], recipe]
          .sort((a: Recipe, b: Recipe) => sortAlphabetically(a.title, b.title))
      }
    };
  })
);
