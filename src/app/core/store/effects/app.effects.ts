import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { I18n } from '../../models/model';
import { SetLanguageAction } from '../../models/model-action';
import { GlobalState, selectTranslations } from '../index';
import { AppInitializationActions, I18nApiActions, NavigationActions } from '../actions';
import { I18nService } from '../../services/i18n.service';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private i18nService: I18nService,
    private store: Store<GlobalState>) {
  }

  @Effect()
  getI18n$ = this.actions$.pipe(
    ofType(AppInitializationActions.setLanguage, NavigationActions.changeLanguage),
    withLatestFrom(this.store.select(selectTranslations)),
    filter(([action, i18n]: [SetLanguageAction, I18n]) => !i18n || !i18n[action.language]),
    exhaustMap(([action, _]: [SetLanguageAction, I18n]) => this.i18nService.getI18n(action.language).pipe(
      map((i18n: I18n) => I18nApiActions.getI18nSuccess({i18n, language: action.language})),
      catchError(() => of(I18nApiActions.getI18nFailure()))
    ))
  );

  @Effect({dispatch: false})
  setUserLanguageToLocaleStore$ = this.actions$.pipe(
    ofType(NavigationActions.changeLanguage),
    tap(({language}) => localStorage.setItem('userLanguage', language)),
  );
}
