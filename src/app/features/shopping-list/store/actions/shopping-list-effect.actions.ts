import { createAction, props } from '@ngrx/store';
import { ShoppingListItem } from '../../../../core/models/model';

export const setActiveShoppingList = createAction(
  '[Shopping List Effect] Set Active ShoppingList',
  props<{ shoppingListId: string }>()
);


export const bulkUpdateShoppingListItems = createAction(
  '[Shopping List Effect] Bulk Update ShoppingList',
  props<{ shoppingListId: string, shoppingListItems: ShoppingListItem[] }>()
);
