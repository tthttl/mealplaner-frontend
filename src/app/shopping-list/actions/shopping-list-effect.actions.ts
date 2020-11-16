import { createAction, props } from '@ngrx/store';
import { ShoppingListItem } from '../../shared/model/model';

export const setActiveShoppingList = createAction(
  '[Shopping List Effect] Set Active ShoppingList',
  props<{ shoppingListId: string }>()
);


export const bulkUpdateShoppingListItems = createAction(
  '[Shopping List Effect] Bulk Update ShoppingList',
  props<{ shoppingListId: string, shoppingListItems: ShoppingListItem[] }>()
);
