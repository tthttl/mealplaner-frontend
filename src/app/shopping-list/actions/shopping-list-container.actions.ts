import { createAction, props } from '@ngrx/store';
import { BasicShoppingListItem, ShoppingList, ShoppingListItem } from '../../shared/model/model';

export const loadShoppingLists = createAction('[Shopping List Container] Load Shopping Lists');

export const changeShoppingList = createAction('[Shopping List Container] Change Shopping List', props<{ shoppingListId: string }>());

export const addShoppingListItem = createAction(
  '[Shopping List Container] Add Shopping List Items',
  props<{ optimisticId: string, shoppingListItem: BasicShoppingListItem }>()
);

export const toggleShoppingListItem = createAction(
  '[Shopping List Container] Toggle Shopping List Items',
  props<{ shoppingListItemId: string,  shoppingList: string}>()
);

export const unToggleShoppingListItem = createAction(
  '[Shopping List Container] unToggle Shopping List Items',
  props<{ shoppingListItemId: string,  shoppingList: string}>()
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
  props<{ shoppingList: ShoppingList }>()
);
