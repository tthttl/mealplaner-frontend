import { I18nService } from './i18n/services/i18n.service';
import { forkJoin } from 'rxjs';
import { Store } from '@ngrx/store';
import { GlobalState } from './shared/state';
import { AppInitializationActions } from './shared/state/app-actions';
import { AuthService } from './auth/services/auth.service';
import { Actions, ofType } from '@ngrx/effects';
import { I18nApiActions } from './i18n/actions';
import { first, takeUntil } from 'rxjs/operators';
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
    const appLanguage: Language = DEFAULT_LANGUAGE.includes(userLanguage) ? userLanguage as Language : DEFAULT_LANGUAGE;
    store.dispatch(AppInitializationActions.loadI18n({language: appLanguage}));

    const loadI18nDone$ = actions$.pipe(
      ofType(I18nApiActions.getI18nSuccess),
      takeUntil(actions$.pipe(ofType(I18nApiActions.getI18nFailure))),
      first()
    );

    const refreshedToken$ = actions$.pipe(
      ofType(AuthApiActions.refreshTokenSuccess),
      takeUntil(actions$.pipe(ofType(AuthApiActions.refreshTokenFailed))),
      first()
    );

    forkJoin([
      loadI18nDone$,
      refreshedToken$
    ]).subscribe()
      .add(resolve);
  });
}
