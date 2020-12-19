import { createAction, props } from '@ngrx/store';
import { BasicShoppingListItem, ShoppingList, ShoppingListItem } from '../../../../core/models/model';

export const setActiveShoppingList = createAction(
  '[Shopping List Effect] Set Active ShoppingList',
  props<{ shoppingListId: string }>()
);


export const bulkUpdateShoppingListItems = createAction(
  '[Shopping List Effect] Bulk Update ShoppingList',
  props<{ shoppingListId: string, shoppingListItems: ShoppingListItem[] }>()
);

export const retryAddShoppingListItem = createAction(
  '[Shopping List API] Retry add Shopping List Items',
  props<{ optimisticId: string, shoppingListItem: BasicShoppingListItem }>()
);

export const undoOptimisticAddShoppingListItem = createAction(
  '[Shopping List API] Undo Optimistic add Shopping List Items',
  props<{ optimisticId: string, shoppingListItem: BasicShoppingListItem }>()
);

export const retryDeleteShoppingListItem = createAction(
  '[Shopping List API] Retry delete Shopping List Items',
  props<{ shoppingListItem: ShoppingListItem }>()
);

export const undoOptimisticDeleteShoppingListItem = createAction(
  '[Shopping List API] Undo Optimistic delete Shopping List Items Success',
  props<{ shoppingListItem: ShoppingListItem }>()
);

export const retryCreateShoppingList = createAction(
  '[Shopping List API] Retry create Shopping list ',
  props<{ title: string }>()
);

export const retryDeleteShoppingList = createAction(
  '[Shopping List API] Retry delete Shopping List',
  props<{ shoppingList: ShoppingList }>()
);

export const undoOptimisticDeleteShoppingList = createAction(
  '[Shopping List API] Undo Optimistic delete Shopping',
  props<{ shoppingList: ShoppingList }>()
);

export const retryEditShoppingList = createAction(
  '[Shopping List API] Retry edit Shopping List',
  props<{ shoppingList: ShoppingList, changes: ShoppingList }>()
);

export const undoOptimisticEditShoppingList = createAction(
  '[Shopping List API] Undo Optimistic edit Shopping',
  props<{ shoppingList: ShoppingList }>()
);

export const retryUpdateShoppingListItems = createAction(
  '[Shopping List API] Retry update Shopping List Items',
  props<{ shoppingListItems: ShoppingListItem[] }>()
);

export const registerShoppingListItemPostForSync = createAction(
  '[Shopping List Effect] Offline Mode: POST Shopping List Item',
  props<{ basicShoppingListItem: BasicShoppingListItem, optimisticId: string}>()
);

export const registerShoppingListItemPostForSyncSuccess = createAction(
  '[Shopping List Effect] Offline Mode: POST Shopping List Item Registered For Sync Successfully'
);

export const registerShoppingListItemUpdatesForSync = createAction(
  '[Shopping List Effect] Offline Mode: UPDATE Shopping List Item',
  props<{ shoppingListItems: ShoppingListItem[] }>()
);

export const registerShoppingListItemUpdatesForSyncSuccess = createAction(
  '[Shopping List Effect] Offline Mode: UPDATE Shopping List Item Registered For Sync Successfully'
);

export const registerShoppingListItemDeleteForSync = createAction(
  '[Shopping List Effect] Offline Mode: DELETE Shopping List Item',
  props<{ shoppingListItem: ShoppingListItem }>()
);

export const registerShoppingListItemDeleteForSyncSuccess = createAction(
  '[Shopping List Effect] Offline Mode: DELETE Shopping List Item Registered For Sync Successfully'
);
