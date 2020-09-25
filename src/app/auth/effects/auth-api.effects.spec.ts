import SpyObj = jasmine.SpyObj;
import { AuthService } from '../services/auth.service';
import { AuthApiEffects } from './auth-api.effects';
import { initialState } from '../../shared/state';
import { of, throwError } from 'rxjs';
import { AuthApiActions, LoginPageActions } from '../actions';
import { Router } from '@angular/router';
import { JwtRenewal, User } from '../../shared/model/model';
import { Action, Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { AppInitializationActions } from '../../shared/state/app-actions';
import { DEFAUT_REDIRECT_URL_FOR_LOGGED_IN_USER } from '../../shared/helpers/constants';

describe('Auth Api Effects', () => {
  let actions$;
  let authService: SpyObj<AuthService>;
  let router: SpyObj<Router>;
  let authApiEffects: AuthApiEffects;

  // tslint:disable-next-line:no-any
  let store: any;

  describe('login', () => {
    beforeEach(() => {
      class StoreMock {
        select = jasmine.createSpy().and.returnValue(of({}));
        dispatch = jasmine.createSpy();
        pipe = jasmine.createSpy().and.returnValue(of('success'));
      }
      TestBed.configureTestingModule({
        providers: [
          {
            provide: Store,
            useClass: StoreMock
          },
          provideMockStore()
        ]
      });
      actions$ = of({type: LoginPageActions.login.type});
      authService = jasmine.createSpyObj('AuthService', ['login']);
      router = jasmine.createSpyObj('Router', ['navigate']);
      store = TestBed.inject(Store);
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
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

  describe('refreshToke', () => {
    beforeEach(() => {
      class StoreMock {
        select = jasmine.createSpy().and.returnValue(of({}));
        dispatch = jasmine.createSpy();
        pipe = jasmine.createSpy().and.returnValue(of('success'));
      }
      TestBed.configureTestingModule({
        providers: [
          {
            provide: Store,
            useClass: StoreMock
          },
          provideMockStore()
        ]
      });
      actions$ = of({type: AppInitializationActions.refreshToken.type});
      authService = jasmine.createSpyObj('AuthService', ['refreshToken']);
      router = jasmine.createSpyObj('Router', ['navigate']);
      store = TestBed.inject(Store);
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
        store);
    });

    it('should return success action', () => {
      authService.refreshToken.and.returnValue(of({success: true, jwt: 'jwt'} as JwtRenewal));
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
      authService.refreshToken.and.returnValue(of({success: false, jwt: ''} as JwtRenewal));
      authApiEffects.refreshToken.subscribe((action: Action) => {
        expect(action.type).toEqual(AuthApiActions.refreshTokenFailed.type);
      });
    });
  });




  describe('redirectWhenLoggedIn', () => {
    beforeEach(() => {
      class StoreMock {
        select = jasmine.createSpy().and.returnValue(of({...initialState}));
        dispatch = jasmine.createSpy();
        pipe = jasmine.createSpy().and.returnValue(of('success'));
      }
      TestBed.configureTestingModule({
        providers: [
          {
            provide: Store,
            useClass: StoreMock
          },
          provideMockStore()
        ]
      });
      actions$ = of({type: AuthApiActions.loginSuccess.type});
      authService = jasmine.createSpyObj('AuthService', ['']);
      router = jasmine.createSpyObj('Router', ['navigate']);
      store = TestBed.inject(Store);
      authApiEffects = new AuthApiEffects(
        actions$,
        authService,
        router,
        store);
    });

    it('should redirect when successfully login', () => {
      authApiEffects.redirectWhenLoggedIn.subscribe(() => {
        expect(router).toHaveBeenCalledWith(DEFAUT_REDIRECT_URL_FOR_LOGGED_IN_USER);
      });
    });
  });
});
