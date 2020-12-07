import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { GlobalState, selectRequestedUrlBeforeLoginWasRequired } from '../../../../core/store';
import {
  AuthApiActions,
  ForgotPasswordContainerActions,
  LoginContainerActions,
  LoginServiceActions,
  RegisterContainerActions, ResetPasswordContainerActions
} from '../actions';
import { catchError, exhaustMap, map, tap, withLatestFrom } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { LoginAction } from '../../../../core/models/model-action';
import { JwtRefreshResponse, User } from '../../../../core/models/model';
import { of } from 'rxjs';
import { AppInitializationActions, ErrorInterceptorActions, NavigationActions } from '../../../../core/store/actions';
import { Router } from '@angular/router';
import { DEFAULT_REDIRECT_URL_FOR_LOGGED_IN_USER, REDIRECT_URL_WHEN_LOGOUT } from '../../../../core/constants/constants';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Injectable()
export class AuthApiEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private snackBarService: SnackbarService,
    private store: Store<GlobalState>) {
  }

  @Effect()
  login$ = this.actions$.pipe(
    ofType(LoginContainerActions.login),
    exhaustMap(({credentials}: LoginAction) => this.authService.login(credentials).pipe(
      map((user: User) => AuthApiActions.loginSuccess({user})),
      catchError((error) => {
        const errorMessage = Array.isArray(error) ? error[0].messages[0].id : 'authBackend.error.connection';
        return of(AuthApiActions.loginFailure({error: errorMessage}));
      })
    )),
  );

  @Effect()
  refreshToken$ = this.actions$.pipe(
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
  logout$ = this.actions$.pipe(
    ofType(ErrorInterceptorActions.logout, NavigationActions.logout),
    exhaustMap(() => this.authService.logout().pipe(
      map(() => AuthApiActions.logoutSuccess()),
      catchError(() => of(AuthApiActions.logoutFailure()))
    )),
  );

  @Effect()
  register$ = this.actions$.pipe(
    ofType(RegisterContainerActions.register),
    exhaustMap(({credentials}) => this.authService.register(credentials).pipe(
      map((user: User) => AuthApiActions.registerSuccess({user})),
      catchError((error) => {
        const errorMessage = Array.isArray(error) ? error[0].messages[0].id : 'authBackend.error.connection';
        return of(AuthApiActions.registerFailure({error: errorMessage}));
      })
    )),
  );

  @Effect()
  sendPasswordResetMail$ = this.actions$.pipe(
    ofType(ForgotPasswordContainerActions.requestEmail),
    exhaustMap(({email}) => this.authService.forgotPassword(email).pipe(
      map(() => AuthApiActions.forgotPasswordSuccess()),
      catchError(() => of(AuthApiActions.forgotPasswordFailure()))
    )),
  );

  @Effect()
  resetPassword$ = this.actions$.pipe(
    ofType(ResetPasswordContainerActions.resetPassword),
    exhaustMap(({password, resetPasswordToken}) => this.authService.resetPassword(password, resetPasswordToken).pipe(
      map((user: User) => AuthApiActions.restPasswordSuccess({user})),
      tap(() => this.snackBarService.openSnackBar('auth.reset-password.success')),
      catchError(() => of(AuthApiActions.restPasswordFailure({error: 'authBackend.resetPassword.failed'})))
    )),
  );

  @Effect({dispatch: false})
  redirectWhenLoggedIn$ = this.actions$.pipe(
    ofType(AuthApiActions.loginSuccess, AuthApiActions.registerSuccess, AuthApiActions.restPasswordSuccess),
    withLatestFrom(this.store.select(selectRequestedUrlBeforeLoginWasRequired)),
    tap(([_, url]) => {
      this.router.navigate([url || DEFAULT_REDIRECT_URL_FOR_LOGGED_IN_USER]);
    }),
  );

  @Effect({dispatch: false})
  redirectWhenLoggedOut$ = this.actions$.pipe(
    ofType(AuthApiActions.logoutSuccess),
    withLatestFrom(this.store.select(selectRequestedUrlBeforeLoginWasRequired)),
    tap(() => {
      this.router.navigate([REDIRECT_URL_WHEN_LOGOUT]);
    }),
  );
}
