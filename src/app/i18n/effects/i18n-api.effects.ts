import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, filter, map, withLatestFrom } from 'rxjs/operators';
import { I18n } from '../../shared/model/model';
import { SetLanguageAction } from '../../shared/model/model-action';
import { GlobalState, selectTranslations } from '../../shared/state';
import { AppInitializationActions } from '../../shared/state/app-actions';
import { I18nApiActions, I18nContainerActions } from '../actions';
import { I18nService } from '../services/i18n.service';

@Injectable()
export class I18nApiEffects {
  constructor(
    private actions$: Actions,
    private i18nService: I18nService,
    private store: Store<GlobalState>) {
  }

  @Effect()
  getI18n = this.actions$.pipe(
    ofType(AppInitializationActions.setLanguage, I18nContainerActions.changeLanguage),
    withLatestFrom(this.store.select(selectTranslations)),
    filter(([action, i18n]: [SetLanguageAction, I18n]) => !i18n || !i18n[action.language]),
    exhaustMap(([action, _]: [SetLanguageAction, I18n]) => this.i18nService.getI18n(action.language).pipe(
      map((i18n: I18n) => I18nApiActions.getI18nSuccess({i18n})),
      catchError(() => of(I18nApiActions.getI18nFailure()))
    ))
  );
}
