import { createAction, props } from '@ngrx/store';
import { ShoppingList, ShoppingListItem, ShoppingListItemMovedEvent, User } from '../../shared/model/model';

export const loadShoppingListItemsSuccess = createAction(
  '[Shopping List API] Load Shopping List Items Success',
  props<{ shoppingListId: string, shoppingListItems: ShoppingListItem[] }>()
);
export const loadShoppingListItemsFailure = createAction('[Shopping List API] Load Shopping List Items Failure');

export const loadShoppingListsSuccess = createAction(
  '[Shopping List API] Load Shopping Lists Success',
  props<{ shoppingLists: ShoppingList[] }>()
);
export const loadShoppingListsFailure = createAction('[Shopping List API] Load Shopping Lists Failure');

export const addShoppingListItemSuccess = createAction(
  '[Shopping List API] Add Shopping List Items Success',
  props<{ shoppingListItem: ShoppingListItem }>()
);
export const addShoppingListItemFailure = createAction(
  '[Shopping List API] Add Shopping List Items Failure',
  props<{ shoppingListItem: ShoppingListItem }>()
);

export const deleteShoppingListItemSuccess = createAction(
  '[Shopping List API] Delete Shopping List Items Success',
  props<{ shoppingListItem: ShoppingListItem }>()
);
export const deleteShoppingListItemFailure = createAction(
  '[Shopping List API] Delete Shopping List Items Failure',
  props<{ shoppingListItem: ShoppingListItem }>()
);

export const updateShoppingListItemSuccess = createAction(
  '[Shopping List API] Delete Shopping List Items Success',
  props<ShoppingListItemMovedEvent>()
);
export const updateShoppingListItemFailure = createAction(
  '[Shopping List API] Delete Shopping List Items Failure',
  props<ShoppingListItemMovedEvent>()
);
