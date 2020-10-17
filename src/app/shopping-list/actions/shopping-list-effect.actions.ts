import { createAction, props } from '@ngrx/store';
import { ShoppingList, ShoppingListItem, User } from '../../shared/model/model';

export const setActiveShoppingList = createAction(
  '[Shopping List Effect] Set Active ShoppingList',
  props<{ shoppingListId: string }>()
);

