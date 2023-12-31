import { Translations } from '../../models/model';
import { appStateReducer } from './app-state.reducers';
import { initialAppState } from '../state/app-state';
import { AuthApiActions } from '../../../features/auth/store/actions';
import {
  AppInitializationActions,
  AuthenticatedGuardActions,
  ErrorInterceptorActions,
  I18nApiActions,
  NavigationActions
} from '../actions';

describe('i18nReducer', () => {
  describe('I18nApiActions.getI18nSuccess', () => {
    it('should add de translations to state', () => {
      expect(appStateReducer({...initialAppState},
        I18nApiActions.getI18nSuccess({
          i18n: {de: {}},
          language: 'de',
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
          i18n: {de: {}},
        },
        I18nApiActions.getI18nSuccess({
          i18n: {
            en: {} as Translations
          },
          language: 'en',
        }))).toEqual({
        ...initialAppState,
        language: 'en',
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
            id: '0',
            name: 'Joe',
            email: 'joe@doe.com',
            jwt: 'jwtToExpire'
          }
        },
        AuthApiActions.refreshTokenSuccess({
          user: {
            id: '0',
            name: 'Joe',
            email: 'joe@doe.com',
            jwt: 'jwtRenewed'
          }
        }))).toEqual({
        ...initialAppState,
        user: {
          id: '0',
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
            id: '0',
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
        AuthApiActions.loginSuccess({
          user: {
            id: '0',
            name: 'Joe',
            email: 'joe@doe.com',
            jwt: 'jwt'
          }
        }))).toEqual({
        ...initialAppState,
        user: {
          id: '0',
          name: 'Joe',
          email: 'joe@doe.com',
          jwt: 'jwt'
        }
      });
    });
  });

  describe('AuthApiActions.registerSuccess', () => {
    it('should set user in store', () => {
      expect(appStateReducer({
          ...initialAppState,
        },
        AuthApiActions.registerSuccess({
          user: {
            id: '0',
            name: 'Joe',
            email: 'joe@doe.com',
            jwt: 'jwt'
          }
        }))).toEqual({
        ...initialAppState,
        user: {
          id: '0',
          name: 'Joe',
          email: 'joe@doe.com',
          jwt: 'jwt'
        }
      });
    });
  });

  describe(' AuthApiActions.restPasswordSuccess', () => {
    it('should set user in store', () => {
      expect(appStateReducer({
          ...initialAppState,
        },
        AuthApiActions.restPasswordSuccess({
          user: {
            id: '0',
            name: 'Joe',
            email: 'joe@doe.com',
            jwt: 'jwt'
          }
        }))).toEqual({
        ...initialAppState,
        user: {
          id: '0',
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

  describe('NavigationActions.changeLanguage', () => {
    it('should switch language in store', () => {
      expect(appStateReducer({
          ...initialAppState,
          language: 'de',
        },
        NavigationActions.changeLanguage({language: 'en'}))).toEqual({
        ...initialAppState,
        language: 'de'
      });
    });
  });

  describe('ErrorInterceptorActions.logout', () => {
    it('should remove user in store', () => {
      expect(appStateReducer({
          ...initialAppState,
          user: {
            id: '0',
            name: 'Joe',
            email: 'joe@doe.com',
            jwt: 'jwt',
          }
        },
        ErrorInterceptorActions.logout())).toEqual({
        ...initialAppState,
        user: null
      });
    });
  });

  describe('NavigationActions.logout', () => {
    it('should remove user in store', () => {
      expect(appStateReducer({
          ...initialAppState,
          user: {
            id: '0',
            name: 'Joe',
            email: 'joe@doe.com',
            jwt: 'jwt',
          }
        },
        NavigationActions.logout())).toEqual({
        ...initialAppState,
        user: null
      });
    });
  });

});
