import { Action, createReducer, on } from '@ngrx/store';
import { addRecipeAtIndex, copyOrCreateArray } from '../../../../core/helpers/helpers';
import { Cookbook, Recipe, } from '../../../../core/models/model';
import {
  CookbookCreatedAction,
  CookbookCreatedFailureAction,
  CookbookCreatedSuccessAction,
  CookbookDeletedFromStateAction,
  CookbookEditedSuccessAction,
  CookbookSelectedAction,
  CreateRecipeAction,
  CreateRecipeSuccessAction,
  CreateRecipeSuccessFailureAction,
  DeleteRecipeFromStateAction,
  EditRecipeSuccessAction,
  LoadRecipeSuccessAction,
  UndoCookbookDeletedFromStateAction,
  UndoDeleteRecipeFromStateAction
} from '../../../../core/models/model-action';
import { CookbookApiActions, CookbookContainerActions } from '../actions';
import { CookbookState, initialCookbookState } from '../state/cookbook-state';

export const cookbookStateReducer = createReducer<CookbookState, Action>(
  initialCookbookState,
  on(CookbookApiActions.loadCookbookSuccess,
    (state: CookbookState, {cookbooks}: { cookbooks: Cookbook[] }) => ({
      ...state,
      activeCookbookId: state.activeCookbookId ? state.activeCookbookId : cookbooks[0].id,
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
  on(CookbookContainerActions.createRecipe, (state: CookbookState, {optimisticId, recipeToSave}: CreateRecipeAction) => {
    return {
      ...state,
      recipes: {
        ...state.recipes,
        [recipeToSave.cookbookId]: [...copyOrCreateArray(state.recipes, recipeToSave.cookbookId), {...recipeToSave, id: optimisticId}]
      }
    };
  }),
  on(CookbookApiActions.createRecipeSuccess, (state: CookbookState, {optimisticId, recipe}: CreateRecipeSuccessAction) => {
    return {
      ...state,
      recipes: {
        ...state.recipes,
        [recipe.cookbookId]: state.recipes[recipe.cookbookId].map((item: Recipe) => {
          return item.id === optimisticId ? recipe : item;
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
  on(CookbookApiActions.editRecipeSuccess, (state: CookbookState, {recipe}: EditRecipeSuccessAction) => {
    return {
      ...state,
      recipes: {
        ...state.recipes,
        [recipe.cookbookId]: state.recipes[recipe.cookbookId].map((item: Recipe) => {
          return item.id === recipe.id ? recipe : item;
        })
      }
    };
  }),
  on(CookbookContainerActions.deleteRecipeFromState, (state: CookbookState, {recipeToDelete}: DeleteRecipeFromStateAction) => {
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
  }),
  on(CookbookContainerActions.selectCookbook, (state: CookbookState, {selectedCookbookId}: CookbookSelectedAction) => {
    return {
      ...state,
      activeCookbookId: selectedCookbookId
    };
  }),
  on(CookbookContainerActions.createCookbook, (state: CookbookState, {optimisticId, title}: CookbookCreatedAction) => {
    return {
      ...state,
      cookbooks: [
        ...state.cookbooks, {id: optimisticId, title}
      ]
    };
  }),
  on(CookbookApiActions.createCookbookSuccess, (state: CookbookState, {optimisticId, cookbook}: CookbookCreatedSuccessAction) => {
    return {
      ...state,
      cookbooks: [
        ...state.cookbooks.map((item: Cookbook) => item.id === optimisticId ? cookbook : item)
      ]
    };
  }),
  on(CookbookApiActions.createCookbookFailure, (state: CookbookState, {optimisticId}: CookbookCreatedFailureAction) => {
    return {
      ...state,
      cookbooks: [
        ...state.cookbooks.filter((item: Cookbook) => item.id !== optimisticId)
      ]
    };
  }),
  on(CookbookApiActions.editCookbookSuccess, (state: CookbookState, {cookbook}: CookbookEditedSuccessAction) => {
    return {
      ...state,
      cookbooks: [
        ...state.cookbooks.map((item: Cookbook) => item.id === cookbook.id ? cookbook : item)
      ]
    };
  }),
  on(CookbookContainerActions.deleteCookbookFromState, (state: CookbookState, {cookbook}: CookbookDeletedFromStateAction) => {
    return {
      ...state,
      cookbooks: [
        ...state.cookbooks.filter((item: Cookbook) => item.id !== cookbook.id)
      ]
    };
  }),
  on(CookbookApiActions.undoDeleteCookbookFromState, (state: CookbookState, {cookbook}: UndoCookbookDeletedFromStateAction) => {
    return {
      ...state,
      cookbooks: [
        ...addRecipeAtIndex(cookbook, state.cookbooks)
      ]
    };
  }),
);
