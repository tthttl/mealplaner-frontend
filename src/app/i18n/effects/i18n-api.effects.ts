import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { TranslationsPerLanguage } from '../../shared/model/model';
import { I18nApiActions } from '../actions';
import { I18nService } from '../services/i18n.service';

@Injectable()
export class I18nApiEffects {
  constructor(
    private actions$: Actions,
    private i18nService: I18nService) {
  }
  @Effect()
  getI18n = this.actions$.pipe(
    ofType(I18nApiActions.getI18n),
    exhaustMap(() => this.i18nService.getI18n().pipe(
      map((allTranslations: TranslationsPerLanguage[]) => I18nApiActions.getI18nSuccess({allTranslations})),
      catchError((err: Error) => I18nApiActions.getI18nFailure)
    ))
  );
}
