import { createReducer, on } from '@ngrx/store';
import { initialAppState } from '../../shared/state/app-state/app-state';
import { I18nApiActions } from '../actions';


export const appStateReducer = createReducer(
  initialAppState,
  on(I18nApiActions.getI18nSuccess, (state = initialAppState, action) => { // TODO tpye
    return {
      ...state,
      i18n: {
        ...state.i18n,
        ...action.i18n
      }
    };
  })
);
