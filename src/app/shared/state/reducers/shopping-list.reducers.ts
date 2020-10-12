import { Action, createReducer, on } from '@ngrx/store';
import { initialShoppingListState, ShoppingListState } from '../states/shopping-list-state';
import { ShoppingListApiActions, ShoppingListContainerActions, ShoppingListEffectActions } from '../../../shopping-list/actions';
import { moveItemInArray } from '../../helpers/helpers';
import {
  AddShoppingListItemAction,
  ChangeShoppingListAction,
  DeleteShoppingListItemAction,
  LoadShoppingListItemsSuccessAction,
  LoadShoppingListsSuccessAction,
  SetActiveShoppingListAction,
  ShoppingListItemMovedAction
} from '../../model/model-action';


export const shoppingListReducers = createReducer<ShoppingListState, Action>(
  initialShoppingListState,
  on(
    ShoppingListApiActions.loadShoppingListsSuccess,
    (state: ShoppingListState, {shoppingLists}: LoadShoppingListsSuccessAction) => {
      return {
        ...state,
        shoppingLists: {
          items: shoppingLists,
        }
      };
    }),
  on(
    ShoppingListEffectActions.setActiveShoppingList,
    ShoppingListContainerActions.changeShoppingList,
    (state: ShoppingListState, {shoppingListId}: ChangeShoppingListAction | SetActiveShoppingListAction) => {
      return {
        ...state,
        activeShoppingList: shoppingListId || undefined,
      };
    }),
  on(
    ShoppingListApiActions.loadShoppingListItemsSuccess,
    (state: ShoppingListState, {shoppingListId, shoppingListItems}: LoadShoppingListItemsSuccessAction) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingListId]: shoppingListItems,
        }
      };
    }),
  on(
    ShoppingListContainerActions.addShoppingListItem,
    (state: ShoppingListState, {shoppingListId, shoppingListItem}: AddShoppingListItemAction) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingListId]: [shoppingListItem, ...state.shoppingListItems[shoppingListId]],
        }
      };
    }
  ),
  on(
    ShoppingListContainerActions.deleteShoppingListItem,
    (state: ShoppingListState, {shoppingListId, shoppingListItem}: DeleteShoppingListItemAction) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingListId]: state.shoppingListItems[shoppingListId].filter((current) => current.id !== shoppingListItem.id),
        }
      };
    }
  ),
  on(
    ShoppingListContainerActions.moveShoppingListItem,
    (state: ShoppingListState, {shoppingListId, currentIndex, previousIndex}: ShoppingListItemMovedAction) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingListId]: moveItemInArray(state.shoppingListItems[shoppingListId], previousIndex, currentIndex),
        }
      };
    }
  )
);
