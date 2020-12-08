import { AuthService } from '../../services/auth.service';
import { AuthApiEffects } from './auth-api.effects';
import { GlobalState, initialState } from '../../../../core/store';
import { of, throwError } from 'rxjs';
import {
  AuthApiActions,
  ForgotPasswordContainerActions,
  LoginContainerActions,
  RegisterContainerActions,
  ResetPasswordContainerActions
} from '../actions';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { JwtRefreshResponse, User } from '../../../../core/models/model';
import { Action, Store } from '@ngrx/store';
import { AppInitializationActions, NavigationActions } from '../../../../core/store/actions';
import { DEFAULT_REDIRECT_URL_FOR_LOGGED_IN_USER, REDIRECT_URL_WHEN_LOGOUT } from '../../../../core/constants/constants';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { LoginFailureAction } from '../../../../core/models/model-action';
import SpyObj = jasmine.SpyObj;

describe('Auth Api Effects', () => {
  let actions$;
  let authService: SpyObj<AuthService>;
  let snackBarService: SpyObj<SnackbarService>;
  let router: SpyObj<Router>;
  let authApiEffects: AuthApiEffects;
  let store: Store<GlobalState>;

  class StoreMock {
    select = jasmine.createSpy().and.returnValue(of({}));
    dispatch = jasmine.createSpy();
    pipe = jasmine.createSpy().and.returnValue(of('success'));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Store,
          useClass: StoreMock
        },
        provideMockStore({initialState}),
      ]
    });
    store = TestBed.inject(Store);
    snackBarService = jasmine.createSpyObj('SnackBarService', ['openSnackBar']);
    router = jasmine.createSpyObj('Router', ['navigate']);
  });

  describe('login$', () => {
    beforeEach(() => {
      actions$ = of({type: LoginContainerActions.login.type});
      authService = jasmine.createSpyObj('AuthService', ['login']);
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
        snackBarService,
        store);
    });

    it('should return loginSuccess action', () => {
      authService.login.and.returnValue(of({} as User));
      authApiEffects.login$.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.loginSuccess.type);
      });
    });


    it('should return loginFailure action', () => {
      authService.login.and.returnValue(throwError('error'));
      authApiEffects.login$.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.loginFailure.type);
        expect((action as LoginFailureAction).error).toEqual('authBackend.error.connection');
      });
    });
  });

  describe('register$', () => {
    beforeEach(() => {
      actions$ = of({type: RegisterContainerActions.register.type});
      authService = jasmine.createSpyObj('AuthService', ['register']);
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
        snackBarService,
        store);
    });

    it('should return registerSuccess success action', () => {
      authService.register.and.returnValue(of({} as User));
      authApiEffects.register$.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.registerSuccess.type);
      });
    });


    it('should return registerFailure action', () => {
      authService.register.and.returnValue(throwError('error'));
      authApiEffects.register$.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.registerFailure.type);
        expect((action as LoginFailureAction).error).toEqual('authBackend.error.connection');
      });
    });
  });

  describe('sendPasswordResetMail$', () => {
    beforeEach(() => {
      actions$ = of({type: ForgotPasswordContainerActions.requestEmail.type});
      authService = jasmine.createSpyObj('AuthService', ['forgotPassword']);
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
        snackBarService,
        store);
    });

    it('should return forgotPasswordSuccess action', () => {
      authService.forgotPassword.and.returnValue(of({ok: true}));
      authApiEffects.sendPasswordResetMail$.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.forgotPasswordSuccess.type);
      });
    });


    it('should return forgotPasswordFailure action', () => {
      authService.forgotPassword.and.returnValue(throwError('error'));
      authApiEffects.sendPasswordResetMail$.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.forgotPasswordFailure.type);
      });
    });
  });

  describe('resetPassword$', () => {
    beforeEach(() => {
      actions$ = of({type: ResetPasswordContainerActions.resetPassword.type});
      authService = jasmine.createSpyObj('AuthService', ['resetPassword']);
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
        snackBarService,
        store);
    });

    it('should return restPasswordSuccess action', () => {
      authService.resetPassword.and.returnValue(of({} as User));
      authApiEffects.sendPasswordResetMail$.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.restPasswordSuccess.type);
      });
    });

    it('should call snackbar when success', () => {
      authService.resetPassword.and.returnValue(of({} as User));
      authApiEffects.sendPasswordResetMail$.subscribe(() => {
        expect(snackBarService).toHaveBeenCalledWith('authBackend.resetPassword.failed');
      });
    });


    it('should return restPasswordFailure action', () => {
      authService.resetPassword.and.returnValue(throwError('error'));
      authApiEffects.sendPasswordResetMail$.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.restPasswordFailure.type);
      });
    });
  });

  describe('refreshToke$', () => {
    beforeEach(() => {
      actions$ = of({type: AppInitializationActions.refreshToken.type});
      authService = jasmine.createSpyObj('AuthService', ['refreshToken']);
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
        snackBarService,
        store);
    });

    it('should return refreshTokenSuccess action', () => {
      authService.refreshToken.and.returnValue(of({ok: true, user: {} as User} as JwtRefreshResponse));
      authApiEffects.refreshToken$.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.refreshTokenSuccess.type);
      });
    });

    it('should return refreshTokenFailed action when an error occurs', () => {
      authService.refreshToken.and.returnValue(throwError('error'));
      authApiEffects.refreshToken$.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.refreshTokenFailed.type);
      });
    });

    it('should return refreshTokenFailed action if renewal fails', () => {
      authService.refreshToken.and.returnValue(of({ok: false, user: null} as JwtRefreshResponse));
      authApiEffects.refreshToken$.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.refreshTokenFailed.type);
      });
    });
  });

  describe('redirectWhenLoggedIn$', () => {
    beforeEach(() => {
      authService = jasmine.createSpyObj('AuthService', ['']);
      router = jasmine.createSpyObj('Router', ['navigateByUrl']);
      snackBarService = jasmine.createSpyObj('SnackBarService', ['openSnackBar']);
    });

    it('should redirect when successfully login', () => {
      actions$ = of({type: AuthApiActions.loginSuccess.type});
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
        snackBarService,
        store);

      authApiEffects.redirectWhenLoggedIn$.subscribe(() => {
        expect(router.navigateByUrl).toHaveBeenCalledWith(DEFAULT_REDIRECT_URL_FOR_LOGGED_IN_USER);
      });
    });

    it('should redirect when successfully registered', () => {
      actions$ = of({type: AuthApiActions.registerSuccess.type});
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
        snackBarService,
        store);

      authApiEffects.redirectWhenLoggedIn$.subscribe(() => {
        expect(router.navigateByUrl).toHaveBeenCalledWith(DEFAULT_REDIRECT_URL_FOR_LOGGED_IN_USER);
      });
    });

    it('should redirect when successfully password reset', () => {
      actions$ = of({type: AuthApiActions.restPasswordSuccess.type});
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
        snackBarService,
        store);

      authApiEffects.redirectWhenLoggedIn$.subscribe(() => {
        expect(router.navigateByUrl).toHaveBeenCalledWith(DEFAULT_REDIRECT_URL_FOR_LOGGED_IN_USER);
      });
    });
  });

  describe('redirectWhenLoggedOut$', () => {
    beforeEach(() => {
      authService = jasmine.createSpyObj('AuthService', ['']);
    });

    it('should redirect when successfully logged out', () => {
      actions$ = of({type: NavigationActions.logout.type});
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
        snackBarService,
        store);

      authApiEffects.redirectWhenLoggedOut$.subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith([REDIRECT_URL_WHEN_LOGOUT]);
      });
    });
  });
});
