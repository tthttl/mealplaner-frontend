import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, interval, of } from 'rxjs';
import {
  catchError,
  concatMap,
  delayWhen,
  exhaustMap,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { DELETION_DELAY, STORAGE_SELECTED_SHOPPING_LIST_ID } from '../../../../core/constants/constants';
import { moveItemInArray, stringBetweenChars } from '../../../../core/helpers/helpers';
import { ShoppingList, ShoppingListItem, SyncItem } from '../../../../core/models/model';
import { ChangeShoppingListAction, SetActiveShoppingListAction } from '../../../../core/models/model-action';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { StorageService } from '../../../../core/services/storage.service';
import { SyncService } from '../../../../core/services/sync.service';
import { GlobalState, selectCurrentShoppingListItems, selectUserID } from '../../../../core/store';
import { CookbookContainerActions } from '../../../cookbook/store/actions';
import { LoadMealDialogActions, MealPlanerContainerActions } from '../../../meal-planer/store/actions';
import { ShoppingListService } from '../../service/shopping-list.service';
import { ShoppingListApiActions, ShoppingListContainerActions, ShoppingListEffectActions } from '../actions';

@Injectable()
export class ShoppingListEffects {
  constructor(
    private actions$: Actions,
    private shoppingListService: ShoppingListService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBarService: SnackbarService,
    private store: Store<GlobalState>,
    private storageService: StorageService,
    private syncService: SyncService,
  ) {
  }

  @Effect()
  getShoppingLists$ = this.actions$.pipe(
    ofType(
      ShoppingListContainerActions.loadShoppingLists,
      CookbookContainerActions.loadShoppingLists,
      LoadMealDialogActions.loadShoppingLists,
    ),
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

      const savedShoppingListId = this.storageService.getItem(STORAGE_SELECTED_SHOPPING_LIST_ID);
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
    filter(() => stringBetweenChars(this.router.routerState.snapshot.url, '/', '?') === 'shopping-list'),
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
      this.storageService.setItem(STORAGE_SELECTED_SHOPPING_LIST_ID, shoppingListId);
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
    ofType(ShoppingListContainerActions.addShoppingListItem,
      CookbookContainerActions.copyIngredientsToShoppingList,
      ShoppingListEffectActions.retryAddShoppingListItem,
    ),
    concatMap(({optimisticId, shoppingListItem}) => this.shoppingListService.addShoppingListItem(shoppingListItem).pipe(
      map((shoppingListItemApi: ShoppingListItem) => {
        return ShoppingListApiActions.addShoppingListItemSuccess({optimisticId, shoppingListItem: shoppingListItemApi});
      }),
      // tslint:disable-next-line:no-any
      catchError((error: any) => {
        if (error.status === 504 || error.status === 0) {
          return of(ShoppingListEffectActions.registerShoppingListItemPostForSync({basicShoppingListItem: shoppingListItem, optimisticId}));
        } else {
          return of(ShoppingListApiActions.addShoppingListItemFailure({optimisticId, shoppingListItem}));
        }
      })
    )),
  );

  @Effect()
  syncShoppingListItemPost = this.actions$.pipe(
    ofType(ShoppingListEffectActions.registerShoppingListItemPostForSync),
    concatMap(({basicShoppingListItem, optimisticId}) => {
        const syncItem: SyncItem = this.syncService.createSyncItemForPost(basicShoppingListItem, optimisticId);
        return this.syncService.registerForSync(syncItem)
          .pipe(
            map(() => ShoppingListEffectActions.registerShoppingListItemPostForSyncSuccess()),
            catchError(() => of(ShoppingListApiActions.addShoppingListItemFailure({
              optimisticId,
              shoppingListItem: syncItem.payload.basicShoppingListItem
            })))
          );
      }
    )
  );

  @Effect()
  retryAddShoppingListItem$ = this.actions$.pipe(
    ofType(ShoppingListApiActions.addShoppingListItemFailure),
    switchMap(({optimisticId, shoppingListItem}) => {
      return this.snackBarService.openSnackBar('backend-failed.error-message', 'backend-failed.retry').afterDismissed().pipe(
        take(1),
        map(({dismissedByAction}) => {
          return dismissedByAction ?
            ShoppingListEffectActions.retryAddShoppingListItem({optimisticId, shoppingListItem}) :
            ShoppingListEffectActions.undoOptimisticAddShoppingListItem({optimisticId, shoppingListItem});
        })
      );
    }),
  );

  @Effect()
  deleteShoppingListItem$ = this.actions$.pipe(
    ofType(ShoppingListContainerActions.deleteShoppingListItem, ShoppingListEffectActions.retryDeleteShoppingListItem),
    mergeMap(({type, shoppingListItem}) => {
      return of({}).pipe(
        tap(() => console.log('started Deleting')),
        delayWhen((action) =>
          (type !== ShoppingListEffectActions.retryDeleteShoppingListItem.type) ? interval(DELETION_DELAY) : interval(0)
        ),
        takeUntil(this.actions$.pipe(ofType(ShoppingListContainerActions.undoDeleteShoppingListItem))),
        mergeMap(() => this.shoppingListService.deleteShoppingListItem(shoppingListItem.id).pipe(
          map(() => ShoppingListApiActions.deleteShoppingListItemSuccess({shoppingListItem})),
          catchError((error) => {
            if (error.status === 504 || error.status === 0) {
              return of(ShoppingListEffectActions.registerShoppingListItemDeleteForSync({shoppingListItem}));
            }
            return of(ShoppingListApiActions.deleteShoppingListItemFailure({shoppingListItem}));
          })
        )),
      );
    })
  );

  @Effect()
  syncShoppingListItemDelete = this.actions$.pipe(
    ofType(ShoppingListEffectActions.registerShoppingListItemDeleteForSync),
    concatMap(({shoppingListItem}) => {
        const syncItem: SyncItem = this.syncService.createSyncItem(shoppingListItem, 'DELETE');
        return this.syncService.registerForSync(syncItem)
          .pipe(
            map(() => ShoppingListEffectActions.registerShoppingListItemDeleteForSyncSuccess()),
            catchError(() => of(ShoppingListApiActions.deleteShoppingListItemFailure({shoppingListItem})))
          );
      }
    )
  );

  @Effect()
  retryDeleteShoppingListItem$ = this.actions$.pipe(
    ofType(ShoppingListApiActions.deleteShoppingListItemFailure),
    switchMap(({shoppingListItem}) => {
      return this.snackBarService.openSnackBar('backend-failed.error-message', 'backend-failed.retry').afterDismissed().pipe(
        take(1),
        map(({dismissedByAction}) => {
          return dismissedByAction ?
            ShoppingListEffectActions.retryDeleteShoppingListItem({shoppingListItem}) :
            ShoppingListEffectActions.undoOptimisticDeleteShoppingListItem({shoppingListItem});
        })
      );
    }),
  );

  @Effect()
  addShoppingListItemsFromMealPlaner$ = this.actions$.pipe(
    ofType(MealPlanerContainerActions.addMeal),
    map(({shoppingListItems}) => {
      return {
        shoppingListItems,
        updateObservables: shoppingListItems.map(shoppingListItem => this.shoppingListService.addShoppingListItem(shoppingListItem))
      };
    }),
    concatMap(({shoppingListItems, updateObservables}) => {
      const a = forkJoin(updateObservables);
      return a.pipe(
        map((shoppingListItemsApi, index) => ShoppingListApiActions.addShoppingListItemsSuccess({shoppingListItems: shoppingListItemsApi})),
        catchError(() => of(ShoppingListApiActions.addShoppingListItemsFailure())));
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
    ofType(ShoppingListEffectActions.bulkUpdateShoppingListItems, ShoppingListEffectActions.retryUpdateShoppingListItems),
    map(({shoppingListItems}) => {
      return {
        shoppingListItems,
        updateObservables: shoppingListItems.map(shoppingListItem => this.shoppingListService.updateShoppingListItem(shoppingListItem))
      };
    }),
    concatMap(({shoppingListItems, updateObservables}) => {
      const a = forkJoin(updateObservables);
      return a.pipe(
        map(() => ShoppingListApiActions.updateShoppingListItemSuccess()),
        catchError((error) => {
          if (error.status === 504 || error.status === 0) {
            return of(ShoppingListEffectActions.registerShoppingListItemUpdatesForSync({shoppingListItems}));
          }
          return of(ShoppingListApiActions.updateShoppingListItemFailure({shoppingListItems}));
        }));
    })
  );

  @Effect()
  syncShoppingListItemUpdates$ = this.actions$.pipe(
    ofType(ShoppingListEffectActions.registerShoppingListItemUpdatesForSync),
    map(({shoppingListItems}) => {
      const syncItems: SyncItem[] = shoppingListItems
        .map((shoppingListItem: ShoppingListItem) => this.syncService
          .createSyncItem(shoppingListItem, 'PUT'));
      return {
        shoppingListItems,
        registries: syncItems.map((syncItem: SyncItem) => this.syncService.registerForSync(syncItem))
      };
    }),
    concatMap(({shoppingListItems, registries}) => {
      return forkJoin(registries).pipe(
        map(() => ShoppingListEffectActions.registerShoppingListItemUpdatesForSyncSuccess()),
        catchError(() => of(ShoppingListApiActions.updateShoppingListItemFailure({shoppingListItems})))
      );
    })
  );

  @Effect()
  retryUpdateShoppingListItem$ = this.actions$.pipe(
    ofType(ShoppingListApiActions.updateShoppingListItemFailure),
    switchMap(({shoppingListItems}) => {
      return this.snackBarService.openSnackBar('backend-failed.error-message', 'backend-failed.retry').afterDismissed().pipe(
        take(1),
        filter(({dismissedByAction}) => dismissedByAction),
        map(() => ShoppingListEffectActions.retryUpdateShoppingListItems({shoppingListItems}))
      );
    }),
  );

  @Effect()
  createShoppingList$ = this.actions$.pipe(
    ofType(ShoppingListContainerActions.createShoppingList, ShoppingListEffectActions.retryCreateShoppingList),
    concatMap(({title}) => this.shoppingListService.createShoppingList(title).pipe(
      map((shoppingList) => {
        return ShoppingListApiActions.createShoppingListSuccess({shoppingList});
      }),
      catchError(() => of(ShoppingListApiActions.createShoppingListFailure({title})))
    )),
  );

  @Effect()
  retryCreateShoppingList$ = this.actions$.pipe(
    ofType(ShoppingListApiActions.createShoppingListFailure),
    switchMap(({title}) => {
      return this.snackBarService.openSnackBar('backend-failed.error-message', 'backend-failed.retry').afterDismissed().pipe(
        take(1),
        filter(({dismissedByAction}) => dismissedByAction),
        map(({dismissedByAction}) => ShoppingListEffectActions.retryCreateShoppingList({title}))
      );
    }),
  );

  @Effect()
  selectNewlyCreatedShoppingList$ = this.actions$.pipe(
    ofType(ShoppingListApiActions.createShoppingListSuccess),
    map(({shoppingList}) => ShoppingListEffectActions.setActiveShoppingList({shoppingListId: shoppingList.id})),
  );

  @Effect()
  editShoppingList$ = this.actions$.pipe(
    ofType(ShoppingListContainerActions.editShoppingList, ShoppingListEffectActions.retryEditShoppingList),
    concatMap(({changes, shoppingList}) => this.shoppingListService.updateShoppingList(changes).pipe(
      map((editedShoppingList) => {
        return ShoppingListApiActions.editShoppingListSuccess({shoppingList: changes});
      }),
      catchError(() => of(ShoppingListApiActions.editShoppingListFailure({changes, shoppingList})))
    )),
  );

  @Effect()
  retryEditShoppingList$ = this.actions$.pipe(
    ofType(ShoppingListApiActions.editShoppingListFailure),
    switchMap(({changes, shoppingList}) => {
      return this.snackBarService.openSnackBar('backend-failed.error-message', 'backend-failed.retry').afterDismissed().pipe(
        take(1),
        map(({dismissedByAction}) => {
          return dismissedByAction ?
            ShoppingListEffectActions.retryEditShoppingList({changes, shoppingList}) :
            ShoppingListEffectActions.undoOptimisticEditShoppingList({shoppingList});
        }));
    }),
  );

  @Effect()
  deleteShoppingList$ = this.actions$.pipe(
    ofType(ShoppingListContainerActions.deleteShoppingList, ShoppingListEffectActions.retryDeleteShoppingList),
    concatMap(({type, shoppingList}) => {
      return of({}).pipe(
        delayWhen((action) =>
          (type !== ShoppingListEffectActions.retryDeleteShoppingList.type) ? interval(DELETION_DELAY) : interval(0)
        ),
        takeUntil(this.actions$.pipe(ofType(ShoppingListContainerActions.undoDeleteShoppingList))),
        mergeMap(() => this.shoppingListService.deleteShoppingList(shoppingList.id).pipe(
          map(() => {
            return ShoppingListApiActions.deleteShoppingListSuccess({shoppingList});
          }),
          catchError(() => of(ShoppingListApiActions.deleteShoppingListFailure({shoppingList})))
        ))
      );
    })
  );


  @Effect()
  retryDeleteShoppingList$ = this.actions$.pipe(
    ofType(ShoppingListApiActions.deleteShoppingListFailure),
    switchMap(({shoppingList}) => {
      return this.snackBarService.openSnackBar('backend-failed.error-message', 'backend-failed.retry').afterDismissed().pipe(
        take(1),
        map(({dismissedByAction}) => {
          return dismissedByAction ?
            ShoppingListEffectActions.retryDeleteShoppingList({shoppingList}) :
            ShoppingListEffectActions.undoOptimisticDeleteShoppingList({shoppingList});
        }));
    }),
  );

  @Effect()
  changeShoppingListIfCurrentGetsDeleted$ = this.actions$.pipe(
    ofType(ShoppingListContainerActions.deleteShoppingList),
    withLatestFrom(this.store),
    filter(([{shoppingList}, store]) => shoppingList.id === store.shoppingListState.activeShoppingList),
    map(([_, store]) => {
      const idOfFirstShoppingList = Object.keys(store.shoppingListState.shoppingLists.entities)[0];
      return ShoppingListEffectActions.setActiveShoppingList({shoppingListId: idOfFirstShoppingList});
    })
  );
}
