import { Action, createReducer, on } from '@ngrx/store';
import { I18n, Language, User } from '../../model/model';
import { AppState, initialAppState } from '../states/app-state';
import { AuthApiActions } from '../../../auth/actions';
import { I18nApiActions } from '../../../i18n/actions';
import { AppInitializationActions, AuthenticatedGuardActions } from '../app-actions';


export const appStateReducer = createReducer<AppState, Action>(
  initialAppState,
  on(
    I18nApiActions.getI18nSuccess,
    (state, {i18n}: { i18n: I18n }) => {
      return {
        ...state,
        i18n: {
          ...state.i18n,
          ...i18n
        }
      };
    }),
  on(
    AuthApiActions.refreshTokenSuccess,
    (state, {jwt}: { jwt: string }) => {
      const copy = {
        ...state
      };

      if (copy.user) {
        copy.user.jwt = jwt;
      }

      return state;
    }),
  on(
    AuthApiActions.refreshTokenFailed,
    (state) => {
      return {
        ...state,
        user: null
      };
    }),
  on(
    AuthApiActions.loginSuccess,
    (state, {user}: { user: User }) => {
      return {
        ...state,
        user: {
          ...user
        },
      };
    }),
  on(
    AuthenticatedGuardActions.setRequestedUrlBeforeLoginWasRequired,
    (state, {url}: { url: string }) => {
      return {
        ...state,
        requestedUrlBeforeLoginWasRequired: url
      };
    }),
  on(
    AppInitializationActions.setLanguage,
    (state, {language}: { language: Language }) => {
      return {
        ...state,
        language,
      };
    })
);
