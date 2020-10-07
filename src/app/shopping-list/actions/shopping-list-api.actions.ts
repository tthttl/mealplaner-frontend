import { createAction, props } from '@ngrx/store';
import { ShoppingListItem, User } from '../../shared/model/model';

export const loadShoppingListItemsSuccess = createAction(
  '[Shopping List API] Load Shopping List Items Success',
  props<{ items: ShoppingListItem[] }>()
);
export const loadShoppingListItemsFailure = createAction('[Shopping List API] Load Shopping List Items Failure');

