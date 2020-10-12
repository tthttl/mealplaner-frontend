import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { AppState, initialAppState } from './states/app-state';
import { appStateReducer } from './reducers/app-state.reducers';
import { isJwtTokenExpired } from '../helpers/helpers';

export interface GlobalState {
  appState: AppState;
}

export const initialState: GlobalState = {
  appState: initialAppState
};

export const reducers: ActionReducerMap<GlobalState> = {
  appState: appStateReducer
};

export const metaReducers: MetaReducer<GlobalState>[] = [];

export const selectAppState = createFeatureSelector<GlobalState, AppState>('appState');

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

export const isLoggedIn = createSelector(
  selectAppState,
  (appState: AppState) => !!appState.user && !isJwtTokenExpired(appState.user.jwt)
);
