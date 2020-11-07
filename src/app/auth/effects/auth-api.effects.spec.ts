import { AuthService } from '../services/auth.service';
import { AuthApiEffects } from './auth-api.effects';
import { GlobalState, initialState } from '../../shared/state';
import { of, throwError } from 'rxjs';
import { AuthApiActions, LoginPageActions } from '../actions';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { JwtRefreshResponse, User } from '../../shared/model/model';
import { Action, Store } from '@ngrx/store';
import { AppInitializationActions } from '../../shared/state/app-actions';
import { DEFAULT_REDIRECT_URL_FOR_LOGGED_IN_USER } from '../../shared/helpers/constants';
import SpyObj = jasmine.SpyObj;
import { SnackbarService } from '../../shared/services/snackbar.service';

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
      actions$ = of({type: AuthApiActions.loginSuccess.type});
      authService = jasmine.createSpyObj('AuthService', ['']);
      router = jasmine.createSpyObj('Router', ['navigate']);
      snackBarService = jasmine.createSpyObj('SnackBarService', ['openSnackBar']);
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
        snackBarService,
        store);
    });

    it('should redirect when successfully login', () => {
      authApiEffects.redirectWhenLoggedIn.subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith([DEFAULT_REDIRECT_URL_FOR_LOGGED_IN_USER]);
      });
    });
  });

  describe('showLoginFailure$', () => {
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
      actions$ = of({type: AuthApiActions.loginFailure.type});
      authService = jasmine.createSpyObj('AuthService', ['']);
      router = jasmine.createSpyObj('Router', ['navigate']);
      snackBarService = jasmine.createSpyObj('SnackBarService', ['openSnackBar']);
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
        snackBarService,
        store);
    });

    it('should show error when login failed', () => {
      authApiEffects.showLoginFailure$.subscribe(() => {
        expect(snackBarService.openSnackBar).toHaveBeenCalledTimes(1);
      });
    });
  });
});
