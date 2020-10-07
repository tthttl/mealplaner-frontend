import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { GlobalState } from '../../shared/state';
import { ShoppingListApiActions, ShoppingListContainerActions } from '../actions';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { LoadShoppingListItems } from '../../shared/model/model-action';
import { ShoppingListItem } from '../../shared/model/model';
import { of } from 'rxjs';
import { ShoppingListService } from '../service/shopping-list.service';

@Injectable()
export class ShoppingListApiEffects {
  constructor(
    private actions$: Actions,
    private shoppingListService: ShoppingListService,
    private store: Store<GlobalState>) {
  }

  @Effect()
  getShoppingListItems = this.actions$.pipe(
    ofType(ShoppingListContainerActions.loadShoppingListItems),
    exhaustMap(({id}: LoadShoppingListItems) => this.shoppingListService.getShoppingListItems(id).pipe(
      map((items: ShoppingListItem[]) => ShoppingListApiActions.loadShoppingListItemsSuccess({items})),
      catchError(() => of(ShoppingListApiActions.loadShoppingListItemsFailure()))
    )),
  );
}
