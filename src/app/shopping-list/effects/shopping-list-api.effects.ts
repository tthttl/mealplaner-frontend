import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { GlobalState, selectCurrentShoppingListItems, selectUser, selectUserID } from '../../shared/state';
import { ShoppingListApiActions, ShoppingListContainerActions, ShoppingListEffectActions } from '../actions';
import { catchError, concatMap, exhaustMap, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ChangeShoppingListAction, SetActiveShoppingListAction, ShoppingListItemMovedAction } from '../../shared/model/model-action';
import { ShoppingList, ShoppingListItem, ShoppingListItemMovedEvent } from '../../shared/model/model';
import { forkJoin, Observable, of } from 'rxjs';
import { ShoppingListService } from '../service/shopping-list.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable()
export class ShoppingListApiEffects {
  constructor(
    private actions$: Actions,
    private shoppingListService: ShoppingListService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<GlobalState>) {
  }

  @Effect()
  getShoppingLists$ = this.actions$.pipe(
    ofType(ShoppingListContainerActions.loadShoppingLists),
    withLatestFrom(this.store.select(selectUserID)),
    filter(([_, userId]) => !!userId),
    exhaustMap(([_, userId]) => this.shoppingListService.getShoppingLists(userId!).pipe(
      map((shoppingLists: ShoppingList[]) => ShoppingListApiActions.loadShoppingListsSuccess({shoppingLists})),
      catchError(() => of(ShoppingListApiActions.loadShoppingListsFailure()))
    )),
  );

  @Effect()
  chooseCurrentShoppingList$ = this.actions$.pipe(
    ofType(ShoppingListApiActions.loadShoppingListsSuccess),
    switchMap(({shoppingLists}) => {
      const requestedShoppingListId = this.activatedRoute.snapshot.queryParams.shoppingListId;
      const shoppingListsIds = shoppingLists.map((shoppingList) => shoppingList.id);
      const selectedShoppingListId  = requestedShoppingListId && shoppingListsIds.includes(requestedShoppingListId) ?
        requestedShoppingListId : shoppingListsIds[0];

      return of(ShoppingListEffectActions.setActiveShoppingList({shoppingListId: selectedShoppingListId})
      );
    }),
  );

  @Effect({dispatch: false})
  setQueryParameterForActiveShoppingList$ = this.actions$.pipe(
    ofType(ShoppingListEffectActions.setActiveShoppingList, ShoppingListContainerActions.changeShoppingList),
    tap(({shoppingListId}) => {
      this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {shoppingListId}});
    })
  );

  @Effect()
  getShoppingListItems$ = this.actions$.pipe(
    ofType(ShoppingListEffectActions.setActiveShoppingList, ShoppingListContainerActions.changeShoppingList),
    exhaustMap(({shoppingListId}: SetActiveShoppingListAction | ChangeShoppingListAction) => {
      return this.shoppingListService.getShoppingListItems(shoppingListId).pipe(
        map((shoppingListItems: ShoppingListItem[]) => {
          return ShoppingListApiActions.loadShoppingListItemsSuccess({shoppingListId, shoppingListItems});
        }),
        catchError(() => of(ShoppingListApiActions.loadShoppingListItemsFailure()))
      );
    }),
  );

  @Effect()
  addShoppingListItem$ = this.actions$.pipe(
    ofType(ShoppingListContainerActions.addShoppingListItem),
    concatMap(({optimisticId, shoppingListItem}) => this.shoppingListService.addShoppingListItem(shoppingListItem).pipe(
      map((shoppingListItemApi: ShoppingListItem) => {
        return ShoppingListApiActions.addShoppingListItemSuccess({optimisticId, shoppingListItem: shoppingListItemApi});
      }),
      catchError(() => of(ShoppingListApiActions.addShoppingListItemFailure({shoppingListItem})))
    )),
  );

  @Effect()
  deleteShoppingListItem$ = this.actions$.pipe(
    ofType(ShoppingListContainerActions.deleteShoppingListItem),
    concatMap(({shoppingListItem}) => this.shoppingListService.deleteShoppingListItem(shoppingListItem.id).pipe(
      map(() => {
        return ShoppingListApiActions.deleteShoppingListItemSuccess({shoppingListItem});
      }),
      catchError(() => of(ShoppingListApiActions.deleteShoppingListItemFailure({shoppingListItem})))
    )),
  );

  @Effect({dispatch: false})
  moveShoppingListItem$ = this.actions$.pipe(
    ofType(ShoppingListContainerActions.moveShoppingListItem),
    withLatestFrom(this.store.select(selectCurrentShoppingListItems)),
    map(([{shoppingListId, previousIndex, currentIndex}, shoppingListItems]): ShoppingListItem[] => {
      const [fromIndex, toIndex] = [previousIndex, currentIndex].sort();
      const itemsToUpdate = shoppingListItems.slice(fromIndex, toIndex + 1);
      const maxOrder = Math.max(...itemsToUpdate.map((shoppingListItem: ShoppingListItem) => shoppingListItem.order || 0));

      return itemsToUpdate
        .map((item, index) => ({...item, order: maxOrder - index}));
    }),
    map((shoppingListItems: ShoppingListItem[]) => {
      return shoppingListItems.map(shoppingListItem => this.shoppingListService.updateShoppingListItem(shoppingListItem));
    }),
    concatMap((updateObservables: Observable<ShoppingListItem>[]) => {
      console.log('here', updateObservables);

      const a = forkJoin(updateObservables);
      console.log('a', a);

      return a.pipe(
        map(() => ShoppingListApiActions.updateShoppingListItemSuccess()),
        catchError(() => of(ShoppingListApiActions.updateShoppingListItemFailure({updateObservables}))));
    })
  );
}
