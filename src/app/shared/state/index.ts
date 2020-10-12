import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { cookbookStateReducer } from '../../cookbook/reducers/cookbook-state.reducers';
import { recipeStateReducer } from '../../cookbook/reducers/recipe-state.reducers';
import { CookbookState, initialCookbookState } from '../../cookbook/state/cookbook-state';
import { initialRecipeState, RecipeState } from '../../cookbook/state/recipe-state';
import { appStateReducer } from './reducers/app-state.reducers';
import { isJwtTokenExpired } from '../helpers/helpers';
import { AppState, initialAppState } from './states/app-state';

export interface GlobalState {
  appState: AppState;
  cookbookState: CookbookState;
  recipeState: RecipeState;
}

export const initialState: GlobalState = {
  appState: initialAppState,
  cookbookState: initialCookbookState,
  recipeState: initialRecipeState
};

export const reducers: ActionReducerMap<GlobalState> = {
  appState: appStateReducer,
  recipeState: recipeStateReducer,
  cookbookState: cookbookStateReducer
};

export const metaReducers: MetaReducer<GlobalState>[] = [];

export const selectAppState = createFeatureSelector<GlobalState, AppState>('appState');
export const selectRecipeState =
  createFeatureSelector<GlobalState, RecipeState>('recipeState');
export const selectCookbookState =
  createFeatureSelector<GlobalState, CookbookState>('cookbookState');

export const selectTranslations = createSelector(
  selectAppState,
  (appState: AppState) => appState.i18n
);

export const selectRecipes = createSelector(
  selectRecipeState,
  (recipeState: RecipeState) => recipeState.recipes
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

export const isLoggedIn = createSelector(
  selectAppState,
  (appState: AppState) => !!appState.user && !isJwtTokenExpired(appState.user.jwt)
);

export const selectCookbooks = createSelector(
  selectCookbookState,
  (cookbookState: CookbookState) => cookbookState.cookbooks);
