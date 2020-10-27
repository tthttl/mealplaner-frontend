import { createAction, props } from '@ngrx/store';
import { BasicShoppingListItem, Recipe } from '../model/model';

export const copyIngredientsToShoppingList = createAction('[CookbookContainer]',
  props<{ optimisticId: string, shoppingListItem: BasicShoppingListItem }>());

export const copyRecipeToMealplaner = createAction('[CookbookContainer]',
  props<{ recipe: Recipe }>());
