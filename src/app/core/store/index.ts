import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { cookbookStateReducer } from '../../features/cookbook/store/reducers/cookbook-state.reducers';
import { CookbookState, initialCookbookState } from '../../features/cookbook/store/state/cookbook-state';
import { isJwtTokenExpired } from '../helpers/helpers';
import { appStateReducer } from './reducers/app-state.reducers';
import { shoppingListReducers } from '../../features/shopping-list/store/reducers/shopping-list.reducers';
import { AppState, initialAppState } from './state/app-state';
import { initialShoppingListState, shoppingListAdapter, shoppingListItemAdapter, ShoppingListState } from '../../features/shopping-list/store/state/shopping-list-state';

export interface GlobalState {
  appState: AppState;
  cookbookState: CookbookState;
  shoppingListState: ShoppingListState;
}

export const initialState: GlobalState = {
  appState: initialAppState,
  cookbookState: initialCookbookState,
  shoppingListState: initialShoppingListState,
};

export const reducers: ActionReducerMap<GlobalState> = {
  appState: appStateReducer,
  shoppingListState: shoppingListReducers,
  cookbookState: cookbookStateReducer
};

export const metaReducers: MetaReducer<GlobalState>[] = [];

export const selectAppState = createFeatureSelector<GlobalState, AppState>('appState');
export const selectCookbookState =
  createFeatureSelector<GlobalState, CookbookState>('cookbookState');
export const selectShoppingListState = createFeatureSelector<GlobalState, ShoppingListState>('shoppingListState');

export const selectTranslations = createSelector(
  selectAppState,
  (appState: AppState) => appState.i18n || {}
);

export const selectRecipes = createSelector(
  selectCookbookState,
  (cookbookState: CookbookState) => cookbookState.recipes
);

export const selectCurrentLanguage = createSelector(
  selectAppState,
  (appState: AppState) => appState.language
);

export const selectUser = createSelector(
  selectAppState,
  (appState: AppState) => appState.user
);

export const selectRequestedUrlBeforeLoginWasRequired = createSelector(
  selectAppState,
  (appState: AppState) => appState.requestedUrlBeforeLoginWasRequired
);

export const selectUserID = createSelector(
  selectAppState,
  (appState: AppState) => appState.user?.id,
);

export const isLoggedIn = createSelector(
  selectAppState,
  (appState: AppState) => !!appState.user && !isJwtTokenExpired(appState.user.jwt)
);

export const selectShoppingListsEntity = createSelector(
  selectShoppingListState,
  (shoppingListState: ShoppingListState) => shoppingListState.shoppingLists.items
);

export const selectShoppingLists = shoppingListAdapter.getSelectors(selectShoppingListsEntity).selectAll ;

export const activeShoppingList = createSelector(
  selectShoppingListState,
  (shoppingListState: ShoppingListState) => shoppingListState.shoppingLists.items.entities[shoppingListState.activeShoppingList || '']
);

export const activeShoppingListId = createSelector(
  selectShoppingListState,
  (shoppingListState: ShoppingListState) => shoppingListState.activeShoppingList
);

export const isActiveShoppingListLoading = createSelector(
  selectShoppingListState,
  (shoppingListState: ShoppingListState) => shoppingListState.activeShoppingList
);


export const selectCurrentShoppingListEntity = createSelector(
  selectShoppingListState,
  (shoppingListState: ShoppingListState) => {
    if (!shoppingListState.activeShoppingList) {
      return shoppingListItemAdapter.getInitialState();
    }

    const items = shoppingListState.shoppingListItems[shoppingListState.activeShoppingList];

    if (!items) {
      return shoppingListItemAdapter.getInitialState();
    }

    return items;
  },
);

export const selectCurrentShoppingListItems = shoppingListItemAdapter.getSelectors(selectCurrentShoppingListEntity).selectAll;

export const selectCookbooks = createSelector(
  selectCookbookState,
  (cookbookState: CookbookState) => cookbookState.cookbooks);

export const selectActiveCookbook = createSelector(
  selectCookbookState,
  (cookbookState: CookbookState) => cookbookState.activeCookbookId);
