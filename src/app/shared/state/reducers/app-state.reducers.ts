import { Action, createReducer, on } from '@ngrx/store';
import { I18n, User } from '../../model/model';
import { AppState, initialAppState } from '../states/app-state';
import { AuthApiActions } from '../../../auth/actions';
import { I18nApiActions } from '../../../i18n/actions';


export const appStateReducer = createReducer<AppState, Action>(
  initialAppState,
  on(
    I18nApiActions.getI18nSuccess,
    (state, {i18n}: {i18n: I18n}) => {
      return {
        ...state,
        i18n: {
          ...i18n
        }
      };
    }),
  on(
    AuthApiActions.refreshTokenSuccess,
    (state, {user}: {user: User | null}) => {
      return {
        ...state,
        user: user || null
      };
    }),
  on(
    AuthApiActions.loginSuccess,
    (state, {user}: {user: User}) => {
      return {
        ...state,
        user: {
          ...user
        }
      };
    })
);
