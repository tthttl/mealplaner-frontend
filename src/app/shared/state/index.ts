import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { AppState, initialAppState } from './states/app-state';
import { appStateReducer } from './reducers/app-state.reducers';
import { isJwtTokenExpired } from '../helpers/helpers';
import { initialShoppingListState, ShoppingListState } from './states/shopping-list-state';
import { shoppingListReducers } from './reducers/shopping-list.reducers';

export interface GlobalState {
  appState: AppState;
  shoppingListState: ShoppingListState;
}

export const initialState: GlobalState = {
  appState: initialAppState,
  shoppingListState: initialShoppingListState,
};

export const reducers: ActionReducerMap<GlobalState> = {
  appState: appStateReducer,
  shoppingListState: shoppingListReducers,
};

export const metaReducers: MetaReducer<GlobalState>[] = [];

export const selectAppState = createFeatureSelector<GlobalState, AppState>('appState');
export const selectShoppingListState = createFeatureSelector<GlobalState, ShoppingListState>('shoppingListState');

export const selectTranslations = createSelector(
  selectAppState,
  (appState: AppState) => appState.i18n
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

export const selectShoppingLists = createSelector(
  selectShoppingListState,
  (shoppingListState: ShoppingListState) => shoppingListState.shoppingLists.items
);

export const activeShoppingListId = createSelector(
  selectShoppingListState,
  (shoppingListState: ShoppingListState) => shoppingListState.activeShoppingList
);

export const selectCurrentShoppingListItems = createSelector(
  selectShoppingListState,
  (shoppingListState: ShoppingListState) => shoppingListState.shoppingListItems[shoppingListState.activeShoppingList || ''] || []
);

