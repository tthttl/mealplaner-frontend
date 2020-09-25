import { I18nService } from './i18n/services/i18n.service';
import { forkJoin } from 'rxjs';
import { Store } from '@ngrx/store';
import { GlobalState } from './shared/state';
import { AppInitializationActions } from './shared/state/app-actions';
import { AuthService } from './auth/services/auth.service';
import { Actions, ofType } from '@ngrx/effects';
import { I18nApiActions } from './i18n/actions';
import { take, takeUntil } from 'rxjs/operators';
import { AuthApiActions } from './auth/actions';
import { Language } from './shared/model/model';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './shared/helpers/constants';

export function appInitializer(
  authService: AuthService,
  i18nService: I18nService,
  store: Store<GlobalState>,
  actions$: Actions
): () => void {
  return () => new Promise(resolve => {
    store.dispatch(AppInitializationActions.refreshToken());

    const userLanguage: string = localStorage.getItem('userLanguage') || navigator.language.substr(0, 2) || DEFAULT_LANGUAGE;
    const appLanguage: Language = SUPPORTED_LANGUAGES.guard(userLanguage) ? userLanguage as Language : DEFAULT_LANGUAGE;
    store.dispatch(AppInitializationActions.setLanguage({language: appLanguage}));

    const loadI18nDone$ = actions$.pipe(
      ofType(I18nApiActions.getI18nSuccess),
      takeUntil(actions$.pipe(ofType(I18nApiActions.getI18nFailure))),
      take(1)
    );

    const refreshedTokenDone$ = actions$.pipe(
      ofType(AuthApiActions.refreshTokenSuccess),
      takeUntil(actions$.pipe(ofType(AuthApiActions.refreshTokenFailed))),
      take(1)
    );

    forkJoin([
      loadI18nDone$,
      refreshedTokenDone$
    ]).subscribe()
      .add(resolve);
  });
}
