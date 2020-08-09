import { createReducer, on } from '@ngrx/store';
import { initialI18nState } from '../../shared/state/i18n/i18nState';
import { I18nApiActions } from '../actions';

export const i18nReducer = createReducer(
  initialI18nState,
  on(I18nApiActions.getI18nSuccess, (state, action) => {
    return {
      ...state,
      i18n: {
        ...state.i18n,
        allTranslations: action.allTranslations
      }
    };
  })
);
