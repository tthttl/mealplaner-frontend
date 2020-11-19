import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, concatMap, delay, exhaustMap, filter, map, mergeMap, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { CookbookContainerActions } from '../../../cookbook/store/actions';
import { DELETION_DELAY } from '../../../../core/constants/constants';
import { ShoppingList, ShoppingListItem } from '../../../../core/models/model';
import { ChangeShoppingListAction, SetActiveShoppingListAction } from '../../../../core/models/model-action';
import { GlobalState, selectCurrentShoppingListItems, selectUserID } from '../../../../core/store';
import { ShoppingListApiActions, ShoppingListContainerActions, ShoppingListEffectActions } from '../actions';
import { ShoppingListService } from '../../service/shopping-list.service';
import { moveItemInArray } from '../../../../core/helpers/helpers';

@Injectable()
export class ShoppingListEffects {
  constructor(
    private actions$: Actions,
    private shoppingListService: ShoppingListService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<GlobalState>) {
  }

  @Effect()
  getShoppingLists$ = this.actions$.pipe(
    ofType(ShoppingListContainerActions.loadShoppingLists, CookbookContainerActions.loadShoppingLists),
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
      const shoppingListsIds = shoppingLists.map((shoppingList) => shoppingList.id);

      const requestedShoppingListId = this.activatedRoute.snapshot.queryParams.shoppingListId;
      if (requestedShoppingListId && shoppingListsIds.includes(requestedShoppingListId)) {
        return of(ShoppingListEffectActions.setActiveShoppingList({shoppingListId: requestedShoppingListId}));
      }

      const savedShoppingListId = localStorage.getItem('selectedShoppingListId');
      if (savedShoppingListId && shoppingListsIds.includes(savedShoppingListId)) {
        return of(ShoppingListEffectActions.setActiveShoppingList({shoppingListId: savedShoppingListId}));
      }

      return of(ShoppingListEffectActions.setActiveShoppingList({shoppingListId: shoppingListsIds[0]}));
    }),
  );

  @Effect({dispatch: false})
  setQueryParameterForActiveShoppingList$ = this.actions$.pipe(
    ofType(
      ShoppingListEffectActions.setActiveShoppingList,
      ShoppingListContainerActions.changeShoppingList,
    ),
    tap(({shoppingListId}) => {
      this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {shoppingListId}});
    })
  );

  @Effect({dispatch: false})
  setLocalStorageForActiveShoppingList$ = this.actions$.pipe(
    ofType(
      ShoppingListEffectActions.setActiveShoppingList,
      ShoppingListContainerActions.changeShoppingList
    ),
    tap(({shoppingListId}) => {
      localStorage.setItem('selectedShoppingListId', shoppingListId);
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
    ofType(ShoppingListContainerActions.addShoppingListItem, CookbookContainerActions.copyIngredientsToShoppingList),
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
    concatMap(({shoppingListItem}) => {
      return of({}).pipe(
        delay(DELETION_DELAY),
        takeUntil(this.actions$.pipe(ofType(ShoppingListContainerActions.undoDeleteShoppingListItem))),
        mergeMap(() =>  this.shoppingListService.deleteShoppingListItem(shoppingListItem.id).pipe(
          map(() => {
            return ShoppingListApiActions.deleteShoppingListItemSuccess({shoppingListItem});
          }),
          catchError(() => of(ShoppingListApiActions.deleteShoppingListItemFailure({shoppingListItem})))
        )),
      );
    })
  );

  @Effect()
  moveShoppingListItem$ = this.actions$.pipe(
    ofType(ShoppingListContainerActions.moveShoppingListItem),
    withLatestFrom(this.store.select(selectCurrentShoppingListItems)),
    map(([{shoppingListId, previousIndex, currentIndex}, shoppingListItems]) => {
      const [fromIndex, toIndex] = [previousIndex, currentIndex].sort();
      const itemsToUpdate = moveItemInArray(shoppingListItems, previousIndex, currentIndex).slice(fromIndex, toIndex + 1);
      const maxOrder = Math.max(...itemsToUpdate.map((shoppingListItem: ShoppingListItem) => shoppingListItem.order || 0));

      moveItemInArray(itemsToUpdate, previousIndex, currentIndex);

      return ShoppingListEffectActions.bulkUpdateShoppingListItems({
        shoppingListId,
        shoppingListItems: itemsToUpdate.map((item, index) => ({...item, order: maxOrder - index})),
      });
    }),
  );

  @Effect()
  bulkUpdateShoppingListItem$ = this.actions$.pipe(
    ofType(ShoppingListEffectActions.bulkUpdateShoppingListItems),
    map(({shoppingListItems}) => {
      return shoppingListItems.map(shoppingListItem => this.shoppingListService.updateShoppingListItem(shoppingListItem));
    }),
    concatMap((updateObservables: Observable<ShoppingListItem>[]) => {
      const a = forkJoin(updateObservables);
      return a.pipe(
        tap(() => console.log('success')),
        map(() => ShoppingListApiActions.updateShoppingListItemSuccess()),
        catchError(() => of(ShoppingListApiActions.updateShoppingListItemFailure({updateObservables}))));
    })
  );

  @Effect()
  createShoppingList$ = this.actions$.pipe(
    ofType(ShoppingListContainerActions.createShoppingList),
    concatMap(({title}) => this.shoppingListService.createShoppingList(title).pipe(
      map((shoppingList) => {
        return ShoppingListApiActions.createShoppingListSuccess({shoppingList});
      }),
      catchError(() => of(ShoppingListApiActions.createShoppingListFailure()))
    )),
  );

  @Effect()
  selectNewlyCreatedShoppingList$ = this.actions$.pipe(
    ofType(ShoppingListApiActions.createShoppingListSuccess),
    map(({shoppingList}) => ShoppingListEffectActions.setActiveShoppingList({shoppingListId: shoppingList.id})),
  );

  @Effect()
  editShoppingList$ = this.actions$.pipe(
    ofType(ShoppingListContainerActions.editShoppingList),
    concatMap(({shoppingList}) => this.shoppingListService.updateShoppingList(shoppingList).pipe(
      map((editedShoppingList) => {
        return ShoppingListApiActions.editShoppingListSuccess({shoppingList: editedShoppingList});
      }),
      catchError(() => of(ShoppingListApiActions.editShoppingListFailure()))
    )),
  );

  @Effect()
  deleteShoppingList$ = this.actions$.pipe(
    ofType(ShoppingListContainerActions.deleteShoppingList),
    concatMap(({shoppingList}) => {
      return of({}).pipe(
        delay(DELETION_DELAY),
        takeUntil(this.actions$.pipe(ofType(ShoppingListContainerActions.undoDeleteShoppingList))),
        mergeMap(() => this.shoppingListService.deleteShoppingList(shoppingList.id).pipe(
          map(() => {
            return ShoppingListApiActions.deleteShoppingListSuccess({shoppingList});
          }),
          catchError(() => of(ShoppingListApiActions.deleteShoppingListFailure()))
        ))
      );
    })
  );

  @Effect()
  changeShoppingListIfCurrentGetsDeleted$ = this.actions$.pipe(
    ofType(ShoppingListContainerActions.deleteShoppingList),
    withLatestFrom(this.store),
    filter(([{shoppingList}, store]) => shoppingList.id === store.shoppingListState.activeShoppingList),
    map(([_, store]) => {
      const idOfFirstShoppingList = Object.keys(store.shoppingListState.shoppingLists.items.entities)[0];
      return ShoppingListEffectActions.setActiveShoppingList({shoppingListId: idOfFirstShoppingList});
    })
  );
}
