import { Translations } from '../../model/model';
import { I18nApiActions } from '../../../i18n/actions';
import { appStateReducer } from './app-state.reducers';
import { initialAppState } from '../states/app-state';
import { AuthApiActions } from '../../../auth/actions';
import { AppInitializationActions, AuthenticatedGuardActions } from '../app-actions';

describe('i18nReducer', () => {
  describe('I18nApiActions.getI18nSuccess', () => {
    it('should add de translations to state', () => {
      expect(appStateReducer({...initialAppState},
        I18nApiActions.getI18nSuccess({
          i18n:  {de: {} }
        }))).toEqual({
        ...initialAppState,
        i18n: {
          de: {},
        }
      });
    });

    it('should add en translations as second language to state', () => {
      expect(appStateReducer({
          ...initialAppState,
          i18n:  {de: {} },
        },
        I18nApiActions.getI18nSuccess({
          i18n: {
            en: {} as Translations
          }
        }))).toEqual({
        ...initialAppState,
        language: 'de',
        user: null,
        i18n: {
          de: {} as Translations,
          en: {} as Translations
        }
      });
    });
  });

  describe('AuthApiActions.refreshTokenSuccess', () => {
    it('should add new token to existing user', () => {
      expect(appStateReducer({
          ...initialAppState,
          user: {
            name: 'Joe',
            email: 'joe@doe.com',
            jwt: 'jwtToExpire'
          }
        },
        AuthApiActions.refreshTokenSuccess({
          user: {
            name: 'Joe',
            email: 'joe@doe.com',
            jwt: 'jwtRenewed'
          }
        }))).toEqual({
        ...initialAppState,
        user: {
          name: 'Joe',
          email: 'joe@doe.com',
          jwt: 'jwtRenewed'
        },
      });
    });
  });

  describe('AuthApiActions.refreshTokenFailed', () => {
    it('should remove user from store', () => {
      expect(appStateReducer({
          ...initialAppState,
          user: {
            name: 'Joe',
            email: 'joe@doe.com',
            jwt: 'jwtToExpire'
          }
        },
        AuthApiActions.refreshTokenFailed())).toEqual({
        ...initialAppState,
        user: null,
      });
    });
  });

  describe('AuthApiActions.loginSuccess', () => {
    it('should set user in store', () => {
      expect(appStateReducer({
          ...initialAppState,
        },
        AuthApiActions.loginSuccess({user: {
            name: 'Joe',
            email: 'joe@doe.com',
            jwt: 'jwt'
          }}))).toEqual({
        ...initialAppState,
        user: {
          name: 'Joe',
          email: 'joe@doe.com',
          jwt: 'jwt'
        }
      });
    });
  });

  describe('AuthenticatedGuardActions.setRequestedUrlBeforeLoginWasRequired.loginSuccess', () => {
    it('should set requestedUrlBeforeLoginWasRequired in store', () => {
      expect(appStateReducer({
          ...initialAppState,
        },
        AuthenticatedGuardActions.setRequestedUrlBeforeLoginWasRequired({url: 'test'}))).toEqual({
        ...initialAppState,
        requestedUrlBeforeLoginWasRequired: 'test'
      });
    });
  });

  describe('AppInitializationActions.setLanguage', () => {
    it('should set language in store', () => {
      expect(appStateReducer({
          ...initialAppState,
        },
        AppInitializationActions.setLanguage({language: 'en'}))).toEqual({
        ...initialAppState,
        language: 'en'
      });
    });
  });

});
