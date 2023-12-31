import { createAction, props } from '@ngrx/store';
import { BasicShoppingListItem, ShoppingList, ShoppingListItem } from '../../../../core/models/model';

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
  '[Shopping List API] Add Shopping List Item Success',
  props<{ optimisticId: string, shoppingListItem: ShoppingListItem }>()
);
export const addShoppingListItemFailure = createAction(
  '[Shopping List API] Add Shopping List Item Failure',
  props<{ optimisticId: string, shoppingListItem: BasicShoppingListItem }>()
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
  '[Shopping List API] Update Shopping List Items Success'
);
export const updateShoppingListItemFailure = createAction(
  '[Shopping List API] Update Shopping List Items Failure',
  props<{ shoppingListItems: ShoppingListItem[] }>()
);

export const addShoppingListItemsSuccess = createAction(
  '[Shopping List API] Add Shopping List Items Success',
  props<{ shoppingListItems: ShoppingListItem[] }>()
);
export const addShoppingListItemsFailure = createAction(
  '[Shopping List API] Add Shopping List Items Failure',
);

export const createShoppingListSuccess = createAction(
  '[Shopping List API] Create Shopping List Success',
  props<{ shoppingList: ShoppingList }>()
);

export const createShoppingListFailure = createAction(
  '[Shopping List API] Create Shopping List  Failure',
  props<{ title: string }>()
);

export const editShoppingListSuccess = createAction(
  '[Shopping List API] Edit Shopping List Success',
  props<{ shoppingList: ShoppingList }>()
);

export const editShoppingListFailure = createAction(
  '[Shopping List API] Edit Shopping List  Failure',
  props<{ shoppingList: ShoppingList, changes: ShoppingList }>()
);

export const deleteShoppingListSuccess = createAction(
  '[Shopping List API] Delete Shopping List Success',
  props<{ shoppingList: ShoppingList }>()
);

export const deleteShoppingListFailure = createAction(
  '[Shopping List API] Delete Shopping List  Failure',
  props<{ shoppingList: ShoppingList }>()
);
