import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Cookbook } from '../../shared/model/model';
import { CookbookApiActions } from '../actions';
import { CookbookService } from '../services/cookbook.service';

@Injectable()
export class CookbookEffects {
  constructor(
    private actions$: Actions,
    private cookbookService: CookbookService
  ) {
  }

  @Effect()
  loadCookbooks = this.actions$.pipe(
    ofType(CookbookApiActions.loadCookbook),
    switchMap(() => this.cookbookService.loadCookbooks('5f1d4b9ed6ace683b709db8d').pipe( // select userId from state
      map((cookbooks: Cookbook[]) => CookbookApiActions.loadCookbookSuccess({cookbooks})),
      catchError(() => of(CookbookApiActions.loadCookbookFailure()))
    ))
  );

}
