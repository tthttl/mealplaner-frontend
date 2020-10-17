import { createAction, props } from '@ngrx/store';
import { BasicShoppingListItem, ShoppingListItem } from '../../shared/model/model';

export const loadShoppingLists = createAction('[Shopping List Container] Load Shopping Lists');

export const changeShoppingList = createAction('[Shopping List Container] Change Shopping List', props<{ shoppingListId: string }>());

export const addShoppingListItem = createAction(
  '[Shopping List Container] Add Shopping List Items',
  props<{ optimisticId: string, shoppingListItem: BasicShoppingListItem }>()
);

export const deleteShoppingListItem = createAction(
  '[Shopping List Container] Delete Shopping List Items',
  props<{ shoppingListItem: ShoppingListItem }>()
);

export const moveShoppingListItem = createAction(
  '[Shopping List Container] Move Shopping List Items',
  props<{ shoppingListId: string, currentIndex: number, previousIndex: number }>()
);


