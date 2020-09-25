import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { I18n } from '../../shared/model/model';
import { I18nApiActions } from '../actions';
import { I18nService } from '../services/i18n.service';
import { of } from 'rxjs';
import { AppInitializationActions } from '../../shared/state/app-actions';
import { LoadI18nAction } from '../../shared/model/model-action';

@Injectable()
export class I18nApiEffects {
  constructor(
    private actions$: Actions,
    private i18nService: I18nService) {
  }

  @Effect()
  getI18n = this.actions$.pipe(
    ofType(AppInitializationActions.setLanguage),
    exhaustMap(({language}: LoadI18nAction) => this.i18nService.getI18n(language).pipe(
      map((i18n: I18n) => I18nApiActions.getI18nSuccess({i18n})),
      catchError(() => of(I18nApiActions.getI18nFailure()))
    ))
  );
}
