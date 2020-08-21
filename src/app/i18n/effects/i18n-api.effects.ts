import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { catchError, exhaustMap, map, withLatestFrom } from 'rxjs/operators';
import { I18n } from '../../shared/model/model';
import { GlobalState } from '../../shared/state';
import { I18nApiActions } from '../actions';
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
    ofType(I18nApiActions.getI18n),
    withLatestFrom(this.store),
    exhaustMap(([action, state]: [Action , GlobalState]) => this.i18nService.getI18n(state.appState.language).pipe(
      map((i18n: I18n | null) => I18nApiActions.getI18nSuccess({i18n})),
      catchError((err: Error) => I18nApiActions.getI18nFailure)
    ))
  );
}
