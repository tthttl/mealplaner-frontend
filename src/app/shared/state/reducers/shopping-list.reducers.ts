import { Action, createReducer, on } from '@ngrx/store';
import { ShoppingListItem } from '../../model/model';
import { initialShoppingListState, ShoppingListState } from '../states/shopping-list-state';
import { ShoppingListApiActions } from '../../../shopping-list/actions';


export const shoppingListReducers = createReducer<ShoppingListState, Action>(
  initialShoppingListState,
  on(
    ShoppingListApiActions.loadShoppingListItemsSuccess,
    (state, {items}: { items: ShoppingListItem[] }) => {
      return {
        ...state,
        items,
      };
    }),
);
