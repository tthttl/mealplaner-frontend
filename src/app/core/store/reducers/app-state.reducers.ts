import { Action, createReducer, on } from '@ngrx/store';
import { AuthApiActions } from '../../../features/auth/store/actions';
import { I18n, Language, User } from '../../models/model';
import {
  AppInitializationActions,
  AuthenticatedGuardActions,
  ErrorInterceptorActions,
  I18nApiActions,
  NavigationActions,
  SyncServiceActions
} from '../actions';
import { AppState, initialAppState } from '../state/app-state';


export const appStateReducer = createReducer<AppState, Action>(
  initialAppState,
  on(
    I18nApiActions.getI18nSuccess,
    (state, {i18n, language}: { i18n: I18n, language: Language }) => {
      return {
        ...state,
        language,
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
    ErrorInterceptorActions.logout,
    AuthApiActions.deleteAccountSuccess,
    NavigationActions.logout,
    (state) => {
      return {
        ...state,
        user: null
      };
    }),
  on(
    AuthApiActions.loginSuccess,
    AuthApiActions.registerSuccess,
    AuthApiActions.restPasswordSuccess,
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
    NavigationActions.changeLanguage,
    (state: AppState, {language}: { language: Language }) => {
      return state.i18n && language in state.i18n ? {
        ...state,
        language,
      } : state;
    }),
  on(
    AppInitializationActions.setLanguage,
    (state: AppState, {language}: { language: Language }) => {
      return {
        ...state,
        language,
      };
    }),
  on(
    SyncServiceActions.setOfflineMode,
    (state: AppState, {isOffline}: { isOffline: boolean }) => {
      return {
        ...state,
        isOffline
      };
    })
);
