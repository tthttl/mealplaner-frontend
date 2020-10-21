import { Action, createReducer, on } from '@ngrx/store';
import { addRecipeAtIndex } from '../../shared/helpers/helpers';
import { Cookbook, Recipe, } from '../../shared/model/model';
import {
  CreateRecipeAction,
  CreateRecipeSuccessAction,
  CreateRecipeSuccessFailureAction,
  DeleteRecipeFromStateAction,
  EditRecipeSuccessAction,
  LoadRecipeSuccessAction,
  UndoDeleteRecipeFromStateAction
} from '../../shared/model/model-action';
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
        [cookbookId]: recipes
      }
    };
  }),
  on(CookbookActions.createRecipe, (state: CookbookState, {optimisticId, recipeToSave}: CreateRecipeAction) => {
    return {
      ...state,
      recipes: {
        ...state.recipes,
        [recipeToSave.cookbookId]: [...state.recipes[recipeToSave.cookbookId], {...recipeToSave, id: optimisticId}]
      }
    };
  }),
  on(CookbookApiActions.createRecipeSuccess, (state: CookbookState, {optimisticId, savedRecipe}: CreateRecipeSuccessAction) => {
    return {
      ...state,
      recipes: {
        ...state.recipes,
        [savedRecipe.cookbookId]: state.recipes[savedRecipe.cookbookId].map((recipe: Recipe) => {
          return recipe.id === optimisticId ? savedRecipe : recipe;
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
          return item.id === editedRecipe.id ? editedRecipe : item;
        })
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
        [recipe.cookbookId]: addRecipeAtIndex(recipe, state.recipes[recipe.cookbookId])
      }
    };
  })
);
