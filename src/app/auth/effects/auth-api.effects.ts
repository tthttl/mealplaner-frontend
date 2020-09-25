import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { GlobalState, selectRequestedUrlBeforeLoginWasRequired } from '../../shared/state';
import { AuthApiActions, LoginPageActions, LoginServiceActions } from '../actions';
import { catchError, exhaustMap, map, tap, withLatestFrom } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { LoginAction } from '../../shared/model/model-action';
import { JwtRefreshResponse, User } from '../../shared/model/model';
import { of } from 'rxjs';
import { AppInitializationActions, ErrorInterceptorActions } from '../../shared/state/app-actions';
import { Router } from '@angular/router';
import { DEFAUT_REDIRECT_URL_FOR_LOGGED_IN_USER } from '../../shared/helpers/constants';

@Injectable()
export class AuthApiEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private store: Store<GlobalState>) {
  }

  @Effect()
  login = this.actions$.pipe(
    ofType(LoginPageActions.login),
    exhaustMap(({credentials}: LoginAction) => this.authService.login(credentials).pipe(
      map((user: User) => AuthApiActions.loginSuccess({user})),
      catchError(() => of(AuthApiActions.loginFailure()))
    )),
  );

  @Effect()
  refreshToken = this.actions$.pipe(
    ofType(AppInitializationActions.refreshToken, LoginServiceActions.refreshToken),
    exhaustMap(() => this.authService.refreshToken().pipe(
      map((jwtRenewal: JwtRefreshResponse) => {
        return (jwtRenewal.ok && jwtRenewal.user) ?
          AuthApiActions.refreshTokenSuccess({user: jwtRenewal.user}) : AuthApiActions.refreshTokenFailed();
      }),
      catchError(() => of(AuthApiActions.refreshTokenFailed()))
    )),
  );

  @Effect()
  logout = this.actions$.pipe(
    ofType(ErrorInterceptorActions.logout),
    exhaustMap(() => this.authService.logout().pipe(
      map(() => AuthApiActions.logoutSuccess()),
      catchError(() => of(AuthApiActions.loginFailure()))
    )),
  );

  @Effect({dispatch: false})
  redirectWhenLoggedIn = this.actions$.pipe(
    ofType(AuthApiActions.loginSuccess),
    withLatestFrom(this.store.select(selectRequestedUrlBeforeLoginWasRequired)),
    tap(([_, url]) => {
      this.router.navigate([url || DEFAUT_REDIRECT_URL_FOR_LOGGED_IN_USER]);
    }),
  );

  @Effect({dispatch: false})
  redirectWhenLoggedOut = this.actions$.pipe(
    ofType(AuthApiActions.logoutSuccess),
    withLatestFrom(this.store.select(selectRequestedUrlBeforeLoginWasRequired)),
    tap(([_, url]) => {
      this.router.navigate(['/']);
    }),
  );
}
