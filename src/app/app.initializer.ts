import { I18nService } from './i18n/services/i18n.service';
import { forkJoin, merge, Observable, race } from 'rxjs';
import { I18n, User } from './shared/model/model';
import { Store } from '@ngrx/store';
import { GlobalState } from './shared/state';
import { AppInitializationActions } from './shared/state/app-actions';
import { AuthService } from './auth/services/auth.service';
import { Action } from '@ngrx/store/src/models';
import { Actions, ofType } from '@ngrx/effects';
import { I18nApiActions } from './i18n/actions';
import { first, takeUntil } from 'rxjs/operators';
import { AuthApiActions } from './auth/actions';

export function appInitializer(
  authService: AuthService,
  i18nService: I18nService,
  store: Store<GlobalState>,
  actions$: Actions
): () => void {
  return () => new Promise(resolve => {
    // Todo get current Lang
    store.dispatch(AppInitializationActions.loadI18n({language: 'de'}));
    store.dispatch(AppInitializationActions.refreshToken());

    const loadI18nDone$ = actions$.pipe(
                ofType(I18nApiActions.getI18nSuccess),
                takeUntil(actions$.pipe(ofType(I18nApiActions.getI18nFailure))),
                first()
    );

    const refreshedToken$ = actions$.pipe(
      ofType(AuthApiActions.refreshTokenSuccess),
      takeUntil(actions$.pipe(ofType(AuthApiActions.refreshTokenSuccess))),
      first()
    );

    forkJoin([
      loadI18nDone$,
      refreshedToken$
    ]).subscribe()
      .add(resolve);
  });
}
