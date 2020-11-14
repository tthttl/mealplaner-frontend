import { AuthService } from '../services/auth.service';
import { AuthApiEffects } from './auth-api.effects';
import { GlobalState, initialState } from '../../shared/state';
import { of, throwError } from 'rxjs';
import {
  AuthApiActions,
  ForgotPasswordContainerActions,
  LoginPageActions,
  RegisterContainerActions,
  ResetPasswordContainerActions
} from '../actions';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { JwtRefreshResponse, User } from '../../shared/model/model';
import { Action, Store } from '@ngrx/store';
import { AppInitializationActions } from '../../shared/state/app-actions';
import { DEFAULT_REDIRECT_URL_FOR_LOGGED_IN_USER } from '../../shared/helpers/constants';
import SpyObj = jasmine.SpyObj;
import { SnackbarService } from '../../shared/services/snackbar.service';
import { CookbookSelectedAction, LoginFailureAction } from '../../shared/model/model-action';

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

  describe('login$', () => {
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
      actions$ = of({type: LoginPageActions.login.type});
      authService = jasmine.createSpyObj('AuthService', ['login']);
      snackBarService = jasmine.createSpyObj('SnackBarService', ['openSnackBar']);
      router = jasmine.createSpyObj('Router', ['navigate']);
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
        snackBarService,
        store);
    });

    it('should return success action', () => {
      authService.login.and.returnValue(of({} as User));
      authApiEffects.login.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.loginSuccess.type);
      });
    });


    it('should return failure action', () => {
      authService.login.and.returnValue(throwError('error'));
      authApiEffects.login.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.loginFailure.type);
        expect((action as LoginFailureAction).error).toEqual('authBackend.error.connection');
      });
    });
  });

  describe('register', () => {
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
      actions$ = of({type: RegisterContainerActions.register.type});
      authService = jasmine.createSpyObj('AuthService', ['register']);
      snackBarService = jasmine.createSpyObj('SnackBarService', ['openSnackBar']);
      router = jasmine.createSpyObj('Router', ['navigate']);
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
        snackBarService,
        store);
    });

    it('should return success action', () => {
      authService.register.and.returnValue(of({} as User));
      authApiEffects.register$.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.registerSuccess.type);
      });
    });


    it('should return failure action', () => {
      authService.register.and.returnValue(throwError('error'));
      authApiEffects.register$.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.registerFailure.type);
        expect((action as LoginFailureAction).error).toEqual('authBackend.error.connection');
      });
    });
  });

  describe('sendPasswordResetMail$', () => {
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
      actions$ = of({type: ForgotPasswordContainerActions.requestEmail.type});
      authService = jasmine.createSpyObj('AuthService', ['forgotPassword']);
      snackBarService = jasmine.createSpyObj('SnackBarService', ['openSnackBar']);
      router = jasmine.createSpyObj('Router', ['navigate']);
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
        snackBarService,
        store);
    });

    it('should return success action', () => {
      authService.forgotPassword.and.returnValue(of({ok: true}));
      authApiEffects.sendPasswordResetMail$.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.forgotPasswordSuccess.type);
      });
    });


    it('should return failure action', () => {
      authService.forgotPassword.and.returnValue(throwError('error'));
      authApiEffects.sendPasswordResetMail$.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.forgotPasswordFailure.type);
      });
    });
  });

  describe('resetPassword$', () => {
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
      actions$ = of({type: ResetPasswordContainerActions.resetPassword.type});
      authService = jasmine.createSpyObj('AuthService', ['resetPassword']);
      snackBarService = jasmine.createSpyObj('SnackBarService', ['openSnackBar']);
      router = jasmine.createSpyObj('Router', ['navigate']);
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
        snackBarService,
        store);
    });

    it('should return success action', () => {
      authService.resetPassword.and.returnValue(of({} as User));
      authApiEffects.sendPasswordResetMail$.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.restPasswordSuccess.type);
      });
    });

    it('should return show success snackbar', () => {
      authService.resetPassword.and.returnValue(of({} as User));
      authApiEffects.sendPasswordResetMail$.subscribe((action: Action) => {
        expect(snackBarService).toHaveBeenCalledWith('authBackend.resetPassword.failed');
      });
    });


    it('should return failure action', () => {
      authService.resetPassword.and.returnValue(throwError('error'));
      authApiEffects.sendPasswordResetMail$.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.restPasswordFailure.type);
      });
    });
  });

  describe('refreshToke$', () => {
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
      actions$ = of({type: AppInitializationActions.refreshToken.type});
      authService = jasmine.createSpyObj('AuthService', ['refreshToken']);
      router = jasmine.createSpyObj('Router', ['navigate']);
      snackBarService = jasmine.createSpyObj('SnackBarService', ['openSnackBar']);
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
        snackBarService,
        store);
    });

    it('should return success action', () => {
      authService.refreshToken.and.returnValue(of({ok: true, user: {} as User} as JwtRefreshResponse));
      authApiEffects.refreshToken.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.refreshTokenSuccess.type);
      });
    });

    it('should return failure action when an error occurs', () => {
      authService.refreshToken.and.returnValue(throwError('error'));
      authApiEffects.refreshToken.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.refreshTokenFailed.type);
      });
    });

    it('should return failure action if renewal fails', () => {
      authService.refreshToken.and.returnValue(of({ok: false, user: null} as JwtRefreshResponse));
      authApiEffects.refreshToken.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.refreshTokenFailed.type);
      });
    });
  });

  describe('redirectWhenLoggedIn$', () => {
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
      authService = jasmine.createSpyObj('AuthService', ['']);
      router = jasmine.createSpyObj('Router', ['navigate']);
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

      authApiEffects.redirectWhenLoggedIn.subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith([DEFAULT_REDIRECT_URL_FOR_LOGGED_IN_USER]);
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

      authApiEffects.redirectWhenLoggedIn.subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith([DEFAULT_REDIRECT_URL_FOR_LOGGED_IN_USER]);
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

      authApiEffects.redirectWhenLoggedIn.subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith([DEFAULT_REDIRECT_URL_FOR_LOGGED_IN_USER]);
      });
    });
  });

});
