import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { appStateReducer } from '../../i18n/reducers/i18n-api.reducers';
import { AppState, initialAppState } from './app-state/app-state';

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
