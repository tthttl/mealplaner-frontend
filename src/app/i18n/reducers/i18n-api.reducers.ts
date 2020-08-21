import { Action, createReducer, on } from '@ngrx/store';
import { I18nApiActions } from '../actions';
import { I18n } from '../../shared/model/model';
import { GlobalState } from '../../shared/state';
import { AppState, initialAppState } from '../../shared/state/app-state/app-state';


export const appStateReducer = createReducer<AppState, Action>(
  initialAppState,
  on(
    I18nApiActions.getI18nSuccess,
    (state, {i18n}: {i18n: (I18n)}) => { //TODO typeing
    return {
      ...state,
      i18n: {
        ...state.i18n,
        ...i18n
      }
    };
  })
);
