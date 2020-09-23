import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { GlobalState } from '../../shared/state';
import { LoginPageActions, AuthApiActions } from '../actions';
import { catchError, exhaustMap, map, tap, withLatestFrom } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { LoginAction } from '../../shared/model/model-action';
import { User } from '../../shared/model/model';
import { of } from 'rxjs';
import { AppInitializationActions } from '../../shared/state/app-actions';

@Injectable()
export class AuthApiEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store: Store<GlobalState>) {
  }

  @Effect()
  login = this.actions$.pipe(
    ofType(LoginPageActions.login),
    withLatestFrom(this.store),
    exhaustMap(([{credentials}, state]: [LoginAction , GlobalState]) => this.authService.login(credentials).pipe(
      map((user: User) => AuthApiActions.loginSuccess({user})),
      catchError((err: Error) => of(AuthApiActions.loginFailure()))
    )),
  );

  @Effect()
  refreshToke = this.actions$.pipe(
    ofType(AppInitializationActions.refreshToken),
    exhaustMap(() => this.authService.refreshToken().pipe(
      map((user: User | null) => AuthApiActions.refreshTokenSuccess({user})),
      catchError((err: Error) => of(AuthApiActions.refreshTokenFailed()))
    )),
  );
}
