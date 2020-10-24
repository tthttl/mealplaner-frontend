import { Action, createReducer, on } from '@ngrx/store';
import { initialShoppingListState, shoppingListAdapter, ShoppingListState } from '../states/shopping-list-state';
import { ShoppingListApiActions, ShoppingListContainerActions, ShoppingListEffectActions } from '../../../shopping-list/actions';
import { moveItemInArray } from '../../helpers/helpers';
import {
  AddShoppingListItemAction,
  AddShoppingListItemSuccessAction,
  ChangeShoppingListAction,
  DeleteShoppingListItemAction,
  LoadShoppingListItemsSuccessAction,
  LoadShoppingListsSuccessAction,
  SetActiveShoppingListAction,
  ShoppingListItemMovedAction,
  ShoppingListToggleAction
} from '../../model/model-action';


export const shoppingListReducers = createReducer<ShoppingListState, Action>(
  initialShoppingListState,
  on(
    ShoppingListApiActions.loadShoppingListsSuccess,
    (state: ShoppingListState, {shoppingLists}: LoadShoppingListsSuccessAction) => {
      return {
        ...state,
        shoppingLists: {
          items: shoppingListAdapter.addMany(shoppingLists, state.shoppingLists.items),
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
    (state: ShoppingListState, {optimisticId, shoppingListItem}: AddShoppingListItemAction) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingListItem.shoppingList]: [
            {id: optimisticId, ...shoppingListItem},
            ...state.shoppingListItems[shoppingListItem.shoppingList]
          ],
        }
      };
    }
  ),
  on(
    ShoppingListApiActions.addShoppingListItemSuccess,
    (state: ShoppingListState, action: AddShoppingListItemSuccessAction) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [action.shoppingListItem.shoppingList]: state.shoppingListItems[action.shoppingListItem.shoppingList].map(shoppingListItem => {
            return shoppingListItem.id === action.optimisticId ? action.shoppingListItem : shoppingListItem;
          })
        }
      };
    }
  ),
  on(
    ShoppingListContainerActions.deleteShoppingListItem,
    (state: ShoppingListState, {shoppingListItem}: DeleteShoppingListItemAction) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingListItem.shoppingList]: state.shoppingListItems[shoppingListItem.shoppingList]
            .filter((current) => current.id !== shoppingListItem.id),
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
  ),
  on(
    ShoppingListContainerActions.toggleShoppingListItem,
    (state: ShoppingListState, {shoppingListItemId, shoppingList}: ShoppingListToggleAction) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingList]: state.shoppingListItems[shoppingList].map(shoppingListItem => {
            return shoppingListItem.id === shoppingListItemId ? {...shoppingListItem, isChecked: true} : shoppingListItem;
          }),
        }
      };
    }
  ),
  on(
    ShoppingListContainerActions.unToggleShoppingListItem,
    (state: ShoppingListState, {shoppingListItemId, shoppingList}: ShoppingListToggleAction) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingList]: state.shoppingListItems[shoppingList].map(shoppingListItem => {
            return shoppingListItem.id === shoppingListItemId ? {...shoppingListItem, isChecked: false} : shoppingListItem;
          }),
        }
      };
    }
  ),
  on(
    ShoppingListApiActions.createShoppingListSuccess,
    (state: ShoppingListState, {shoppingList}) => {
      return {
        ...state,
        shoppingLists: {
          items: shoppingListAdapter.addOne(shoppingList, state.shoppingLists.items),
        },
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingList.id]: []
        },
        activeShoppingList: shoppingList.id,
      };
    }
  ),
  on(
    ShoppingListContainerActions.editShoppingList,
    (state: ShoppingListState, {shoppingList}) => {
      return {
        ...state,
        shoppingLists: {
          items: shoppingListAdapter.updateOne({id: shoppingList.id, changes: shoppingList}, state.shoppingLists.items),
        },
      };
    }
  ),
  on(
    ShoppingListContainerActions.deleteShoppingList,
    (state: ShoppingListState, {shoppingList}) => {
      return {
        ...state,
        shoppingLists: {
          ...state.shoppingLists,
          items: shoppingListAdapter.removeOne(shoppingList.id, state.shoppingLists.items),
        },
      };
    }
  ),
  on(
    ShoppingListContainerActions.undoDeleteShoppingList,
    (state: ShoppingListState, {shoppingList}) => {
      return {
        ...state,
        shoppingLists: {
          ...state.shoppingLists,
          items: shoppingListAdapter.addOne(shoppingList, state.shoppingLists.items),
        },
      };
    }
  ),
  on(
    ShoppingListApiActions.deleteShoppingListSuccess,
    (state: ShoppingListState, {shoppingList}) => {
      const copyShoppingListsItems = {...state.shoppingListItems};

      if (copyShoppingListsItems.hasOwnProperty(shoppingList.id)) {
        delete copyShoppingListsItems[shoppingList.id];
      }

      return {
        ...state,
        shoppingListItems: copyShoppingListsItems,
      };
    }
  )
);
