import { Action, createReducer, on } from '@ngrx/store';
import { AuthApiActions } from '../../../auth/actions';
import { I18nApiActions, I18nContainerActions } from '../../../i18n/actions';
import { I18n, Language, User } from '../../model/model';
import { AppInitializationActions, AuthenticatedGuardActions, ErrorInterceptorActions, NavActions } from '../app-actions';
import { AppState, initialAppState } from '../states/app-state';


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
    (state, {user}: { user: User }) => {
      return {
        ...state,
        user: {
          ...user
        }
      };
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
    }),
  on(
    ErrorInterceptorActions.logout,
    NavActions.logout,
    (state) => {
      return {
        ...state,
        user: null,
      };
    }),
  on(I18nContainerActions.changeLanguage, (state: AppState, {language}: { language: Language }) => {
    return {
      ...state,
      language
    };
  })
);
