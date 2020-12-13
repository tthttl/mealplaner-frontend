import { Action, createReducer, on } from '@ngrx/store';
import { initialShoppingListState, shoppingListAdapter, shoppingListItemAdapter, ShoppingListState } from '../state/shopping-list-state';
import { ShoppingListApiActions, ShoppingListContainerActions, ShoppingListEffectActions } from '../actions';
import {
  AddShoppingListItemAction,
  AddShoppingListItemSuccessAction,
  ChangeShoppingListAction,
  DeleteShoppingListItemAction,
  LoadShoppingListItemsSuccessAction,
  LoadShoppingListsSuccessAction,
  SetActiveShoppingListAction
} from '../../../../core/models/model-action';


export const shoppingListReducers = createReducer<ShoppingListState, Action>(
  initialShoppingListState,
  on(
    ShoppingListApiActions.loadShoppingListsSuccess,
    (state: ShoppingListState, {shoppingLists}: LoadShoppingListsSuccessAction) => {
      return {
        ...state,
        shoppingLists: shoppingListAdapter.addMany(shoppingLists, state.shoppingLists),
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
        shoppingLists: shoppingListAdapter.updateOne({id: shoppingListId, changes: {isInitialized: true}}, state.shoppingLists),
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingListId]: shoppingListItemAdapter.addMany(shoppingListItems, shoppingListItemAdapter.getInitialState()),
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
          [shoppingListItem.shoppingList]: shoppingListItemAdapter.addOne(
            {id: optimisticId, ...shoppingListItem},
            state.shoppingListItems[shoppingListItem.shoppingList])
        }
      };
    }
  ),
  on(
    ShoppingListApiActions.addShoppingListItemsSuccess,
    (state: ShoppingListState, {shoppingListItems}) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingListItems[0].shoppingList]: shoppingListItemAdapter.addMany(
            shoppingListItems,
            state.shoppingListItems[shoppingListItems[0].shoppingList])
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
          [action.shoppingListItem.shoppingList]: shoppingListItemAdapter.updateOne(
            {id: action.optimisticId, changes: action.shoppingListItem},
            state.shoppingListItems[action.shoppingListItem.shoppingList]
          )
        }
      };
    }
  ),
  on(
    ShoppingListEffectActions.undoOptimisticAddShoppingListItem,
    (state: ShoppingListState, {optimisticId, shoppingListItem}) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingListItem.shoppingList]: shoppingListItemAdapter.removeOne(
            optimisticId,
            state.shoppingListItems[shoppingListItem.shoppingList]
          )
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
          [shoppingListItem.shoppingList]: shoppingListItemAdapter.removeOne(
            shoppingListItem.id,
            state.shoppingListItems[shoppingListItem.shoppingList]
          )
        }
      };
    }
  ),
  on(
    ShoppingListContainerActions.undoDeleteShoppingListItem,
    ShoppingListEffectActions.undoOptimisticDeleteShoppingListItem,
    (state: ShoppingListState, {shoppingListItem}) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingListItem.shoppingList]: shoppingListItemAdapter.addOne(
            shoppingListItem,
            state.shoppingListItems[shoppingListItem.shoppingList]
          )
        }
      };
    }
  ),
  on(
    ShoppingListEffectActions.bulkUpdateShoppingListItems,
    (state: ShoppingListState, {shoppingListItems, shoppingListId}) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingListId]: shoppingListItemAdapter.updateMany(
            shoppingListItems.map(shoppingListItem => ({id: shoppingListItem.id, changes: shoppingListItem})),
            state.shoppingListItems[shoppingListId]
          )
        }
      };
    }
  ),
  on(
    ShoppingListApiActions.createShoppingListSuccess,
    (state: ShoppingListState, {shoppingList}) => {
      return {
        ...state,
        shoppingLists: shoppingListAdapter.addOne(shoppingList, state.shoppingLists),
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingList.id]: shoppingListItemAdapter.getInitialState(),
        },
        activeShoppingList: shoppingList.id,
      };
    }
  ),
  on(
    ShoppingListContainerActions.editShoppingList,
    (state: ShoppingListState, {changes}) => {
      return {
        ...state,
        shoppingLists: shoppingListAdapter.updateOne({id: changes.id, changes}, state.shoppingLists),
      };
    }
  ),
  on(
    ShoppingListEffectActions.undoOptimisticEditShoppingList,
    (state: ShoppingListState, {shoppingList}) => {
      return {
        ...state,
        shoppingLists: shoppingListAdapter.updateOne({id: shoppingList.id, changes: shoppingList}, state.shoppingLists),
      };
    }
  ),
  on(
    ShoppingListContainerActions.deleteShoppingList,
    (state: ShoppingListState, {shoppingList}) => {
      return {
        ...state,
        shoppingLists: shoppingListAdapter.removeOne(shoppingList.id, state.shoppingLists),
      };
    }
  ),
  on(
    ShoppingListContainerActions.undoDeleteShoppingList,
    ShoppingListEffectActions.undoOptimisticDeleteShoppingList,
    (state: ShoppingListState, {shoppingList}) => {
      return {
        ...state,
        shoppingLists: shoppingListAdapter.addOne(shoppingList, state.shoppingLists),
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
