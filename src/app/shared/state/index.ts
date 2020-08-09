import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { i18nReducer } from '../../i18n/reducers/i18n-api.reducers';
import { I18nState, initialI18nState } from './i18n/i18nState';

export interface GlobalState {
  i18n: I18nState;
}

export const initialState: GlobalState = {
  i18n: initialI18nState
};

export const reducers: ActionReducerMap<GlobalState> = {
  i18n: i18nReducer
};

export const metaReducers: MetaReducer<GlobalState>[] = [];

export const selectI18nState = createFeatureSelector<GlobalState, I18nState>('i18n');

export const selectTranslations = createSelector(
  selectI18nState,
  (state: I18nState) => state.i18n.allTranslations
);
