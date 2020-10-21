import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { cookbookStateReducer } from '../../cookbook/reducers/cookbook-state.reducers';
import { CookbookState, initialCookbookState } from '../../cookbook/state/cookbook-state';
import { isJwtTokenExpired } from '../helpers/helpers';
import { initialShoppingListState, ShoppingListState } from './states/shopping-list-state';
import { shoppingListReducers } from './reducers/shopping-list.reducers';
import { appStateReducer } from './reducers/app-state.reducers';
import { AppState, initialAppState } from './states/app-state';

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
  (appState: AppState) => appState.i18n
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


export const selectCookbooks = createSelector(
  selectCookbookState,
  (cookbookState: CookbookState) => cookbookState.cookbooks);

export const selectActiveCookbook = createSelector(
  selectCookbookState,
  (cookbookState: CookbookState) => cookbookState.activeCookbookId);
