import { createAction, props } from '@ngrx/store';
import { BasicShoppingListItem, ShoppingList, ShoppingListItem, ShoppingListItemMovedEvent, User } from '../../shared/model/model';
import { Observable } from 'rxjs';

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
  props<{ optimisticId: string, shoppingListItem: ShoppingListItem }>()
);
export const addShoppingListItemFailure = createAction(
  '[Shopping List API] Add Shopping List Items Failure',
  props<{ shoppingListItem: BasicShoppingListItem }>()
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
  '[Shopping List API] Delete Shopping List Items Success'
);
export const updateShoppingListItemFailure = createAction(
  '[Shopping List API] Delete Shopping List Items Failure',
  props<{updateObservables: Observable<ShoppingListItem>[]}>()
);
