import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './core/constants/constants';
import { Language } from './core/models/model';
import { I18nService } from './core/services/i18n.service';
import { GlobalState } from './core/store';
import { AppInitializationActions, I18nApiActions } from './core/store/actions';
import { AuthService } from './features/auth/services/auth.service';
import { AuthApiActions } from './features/auth/store/actions';

export function appInitializer(
  authService: AuthService,
  i18nService: I18nService,
  store: Store<GlobalState>,
  actions$: Actions
): () => void {
  return () => new Promise(resolve => {
    const userLanguage: string = localStorage.getItem('userLanguage') || getBrowserLanguage() || DEFAULT_LANGUAGE;
    const appLanguage: Language = SUPPORTED_LANGUAGES.guard(userLanguage) ? userLanguage as Language : DEFAULT_LANGUAGE;
    store.dispatch(AppInitializationActions.setLanguage({language: appLanguage}));

    if (navigator.onLine) {
      store.dispatch(AppInitializationActions.refreshToken());

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
    } else {
      actions$.pipe(
        ofType(I18nApiActions.getI18nSuccess),
        takeUntil(actions$.pipe(ofType(I18nApiActions.getI18nFailure))),
        take(1)
      ).subscribe().add(resolve);
    }

  });
}

function getBrowserLanguage(): string {
  return navigator.language.substr(0, 2);
}
