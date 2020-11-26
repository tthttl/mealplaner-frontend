import { createAction, props } from '@ngrx/store';
import { BasicShoppingListItem, ShoppingList, ShoppingListItem } from '../../../../core/models/model';

export const loadShoppingLists = createAction('[Shopping List Container] Load Shopping Lists');

export const changeShoppingList = createAction('[Shopping List Container] Change Shopping List', props<{ shoppingListId: string }>());

export const addShoppingListItem = createAction(
  '[Shopping List Container] Add Shopping List Items',
  props<{ optimisticId: string, shoppingListItem: BasicShoppingListItem }>()
);


export const undoDeleteShoppingListItem = createAction(
  '[Shopping List Container] unToggle Shopping List Items',
  props<{ shoppingListItem: ShoppingListItem}>()
);

export const deleteShoppingListItem = createAction(
  '[Shopping List Container] Delete Shopping List Items',
  props<{ shoppingListItem: ShoppingListItem }>()
);

export const moveShoppingListItem = createAction(
  '[Shopping List Container] Move Shopping List Items',
  props<{ shoppingListId: string, currentIndex: number, previousIndex: number }>()
);

export const createShoppingList = createAction(
  '[Shopping List Container] Create new ShoppingList',
  props<{ title: string }>()
);

export const editShoppingList = createAction(
  '[Shopping List Container] Edit ShoppingList',
  props<{ shoppingList: ShoppingList, changes: ShoppingList }>()
);

export const deleteShoppingList = createAction(
  '[Shopping List Container] Delete shopping list',
  props<{ shoppingList: ShoppingList }>()
);

export const undoDeleteShoppingList = createAction(
  '[Shopping List Container] Undo Delete shopping',
  props<{ shoppingList: ShoppingList }>()
);
