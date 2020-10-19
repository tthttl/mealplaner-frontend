import { createAction, props } from '@ngrx/store';

export const setActiveShoppingList = createAction(
  '[Shopping List Effect] Set Active ShoppingList',
  props<{ shoppingListId: string }>()
);

