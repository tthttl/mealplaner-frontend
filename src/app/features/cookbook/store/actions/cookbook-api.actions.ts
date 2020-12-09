import { createAction, props } from '@ngrx/store';
import { Cookbook, Recipe } from '../../../../core/models/model';

export const loadCookbookSuccess = createAction('[loadCookbook Effect] Load Cookbooks Success',
  props<{ cookbooks: Cookbook[] }>()
);
export const loadCookbookFailure = createAction('[loadCookbook Effect] Load Cookbooks Failure');
export const createCookbookSuccess = createAction('[createCookbook Effect] Create Cookbooks Success',
  props<{ optimisticId: string, cookbook: Cookbook }>()
);
export const createCookbookFailure = createAction('[createCookbook Effect] Create Cookbooks Failure',
  props<{ optimisticId: string }>()
);
export const editCookbookSuccess = createAction('[editCookbook Effect] Edit Cookbooks Success',
  props<{ cookbook: Cookbook }>()
);
export const editCookbookFailure = createAction('[editCookbook Effect] Edit Cookbooks Failure');
export const deleteCookbookSuccess = createAction('[deleteCookbook Effect] Delete Cookbooks Success',
  props<{ cookbook: Cookbook }>()
);
export const undoDeleteCookbookFromState = createAction(
  '[Cookbook Effect] Undo Delete Cookbooks From State',
  props<{ cookbook: Cookbook }>()
);

export const loadRecipesSuccess = createAction(
  '[LoadRecipe Effect] Get Recipes Success',
  props<{ cookbookId: string, recipes: Recipe[] }>()
);
export const loadRecipesFailure = createAction('[LoadRecipe Effect] Get Recipes Failure');
export const deleteRecipeSuccess = createAction(
  '[DeleteRecipe Effect] Delete Recipe Success',
  props<{ deletedRecipe: Recipe }>()
);

export const loadSpecificRecipesSuccess = createAction(
  '[LoadRecipe Effect] Get Specific Recipes Success',
  props<{ cookbookId: string, recipes: Recipe[] }>()
);
export const loadSpecificRecipesFailure = createAction('[LoadRecipe Effect] Get Specific Recipes Failure');

export const deleteRecipeFailure = createAction('[DeleteRecipe Effect] Delete Recipe Failure');
export const undoDeleteRecipeFromState = createAction('[DeleteRecipe Effect] Undo delete Recipe from State',
  props<{ recipe: Recipe }>());

export const setActiveCookbookIdAsQueryParam = createAction('[ChooseActiveCookbookId Effect] Set Active CookbookId As QueryParam',
  props<{ selectedCookbookId: string }>()
);
