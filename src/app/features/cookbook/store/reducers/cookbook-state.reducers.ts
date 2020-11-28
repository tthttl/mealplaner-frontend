import { Action, createReducer, on } from '@ngrx/store';
import { addItemAtIndex, copyOrCreateArray } from '../../../../core/helpers/helpers';
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
  LoadRecipesSuccessAction,
  LoadRecipeSuccessAction,
  UndoCookbookDeletedFromStateAction,
  UndoDeleteRecipeFromStateAction
} from '../../../../core/models/model-action';
import { CookbookApiActions, CookbookContainerActions, RecipeApiActions, RecipeContainerActions } from '../actions';
import { CookbookState, initialCookbookState } from '../state/cookbook-state';

export const cookbookStateReducer = createReducer<CookbookState, Action>(
  initialCookbookState,
  on(CookbookApiActions.loadCookbookSuccess,
    (state: CookbookState, {cookbooks}: { cookbooks: Cookbook[] }) => ({
      ...state,
      cookbooks
    })
  ),
  on(CookbookApiActions.loadRecipesSuccess, (state: CookbookState, {cookbookId, recipes}: LoadRecipesSuccessAction) => {
    return {
      ...state,
      recipes: {
        ...state.recipes,
        [cookbookId]: recipes
      }
    };
  }),
  on(RecipeContainerActions.createRecipe, (state: CookbookState, {optimisticId, recipeToSave}: CreateRecipeAction) => {
    return {
      ...state,
      recipes: {
        ...state.recipes,
        [recipeToSave.cookbookId]: [...copyOrCreateArray(state.recipes, recipeToSave.cookbookId), {...recipeToSave, id: optimisticId}]
      }
    };
  }),
  on(RecipeApiActions.createRecipeSuccess, (state: CookbookState, {optimisticId, recipe}: CreateRecipeSuccessAction) => {
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
  on(RecipeApiActions.createRecipeFailure, (state: CookbookState, {optimisticId, cookbookId}: CreateRecipeSuccessFailureAction) => {
    return {
      ...state,
      recipes: {
        ...state.recipes,
        [cookbookId]: state.recipes[cookbookId].filter((recipe: Recipe) => recipe.id !== optimisticId)
      }
    };
  }),
  on(RecipeApiActions.editRecipeSuccess, (state: CookbookState, {recipe}: EditRecipeSuccessAction) => {
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
        [recipe.cookbookId]: addItemAtIndex(recipe, state.recipes[recipe.cookbookId])
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
        ...addItemAtIndex(cookbook, state.cookbooks)
      ]
    };
  }),
  on(RecipeApiActions.loadRecipeSuccess, (state: CookbookState, {recipe}: LoadRecipeSuccessAction) => {
    return {
      ...state,
      activeCookbookId: recipe.cookbookId,
      recipes: {
        ...state.recipes,
        [recipe.cookbookId]: addItemAtIndex(recipe, state.recipes[recipe.cookbookId])
      }
    };
  }),
  on(CookbookApiActions.setActiveCookbookIdAsQueryParam, (state: CookbookState, {selectedCookbookId}: {selectedCookbookId: string}) => {
    return {
      ...state,
      activeCookbookId: selectedCookbookId
    };
  }),
);
