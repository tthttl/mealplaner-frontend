import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { GlobalState, selectUserID } from '../../../../core/store';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { MealPlanerService } from '../../services/meal-planer.service';
import { MealPlanerApiActions, MealPlanerContainerActions, MealPlanerEffectActions } from '../actions';
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
import { MealPlaner } from '../../../../core/models/model';
import { interval, of } from 'rxjs';
import { DELETION_DELAY } from '../../../../core/constants/constants';
import { StorageService } from '../../../../core/services/storage.service';

@Injectable()
export class MealPlanersEffects {
  constructor(
    private actions$: Actions,
    private mealPlanerService: MealPlanerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private snackBarService: SnackbarService,
    private store: Store<GlobalState>) {
  }

  @Effect()
  getMealPlaners$ = this.actions$.pipe(
    ofType(MealPlanerContainerActions.loadMealPlaners),
    withLatestFrom(this.store.select(selectUserID)),
    filter(([_, userId]) => !!userId),
    exhaustMap(([_, userId]) => this.mealPlanerService.getMealPlaners(userId!).pipe(
      map((mealPlaners: MealPlaner[]) => MealPlanerApiActions.loadMealPlanersSuccess({mealPlaners})),
      catchError(() => of(MealPlanerApiActions.loadMealPlanersFailure()))
    )),
  );

  @Effect()
  chooseCurrentMealPlaner$ = this.actions$.pipe(
    ofType(MealPlanerApiActions.loadMealPlanersSuccess),
    switchMap(({mealPlaners}) => {
      const mealPlanerIds = mealPlaners.map((mealPlaner) => mealPlaner.id);

      const requestedMealPlanerId = this.activatedRoute.snapshot.queryParams.mealPlanerId;
      if (requestedMealPlanerId && mealPlanerIds.includes(requestedMealPlanerId)) {
        return of(MealPlanerEffectActions.setActiveMealPlaner({mealPlanerId: requestedMealPlanerId}));
      }

      const savedMealPlanerId = this.storageService.getItem('selectedMealPlanerId');
      if (savedMealPlanerId && mealPlanerIds.includes(savedMealPlanerId)) {
        return of(MealPlanerEffectActions.setActiveMealPlaner({mealPlanerId: savedMealPlanerId}));
      }

      return of(MealPlanerEffectActions.setActiveMealPlaner({mealPlanerId: mealPlanerIds[0]}));
    }),
  );

  @Effect({dispatch: false})
  setQueryParameterForActiveMealPlaner$ = this.actions$.pipe(
    ofType(
      MealPlanerEffectActions.setActiveMealPlaner,
      MealPlanerContainerActions.changeSelectedMealPlaner,
    ),
    tap(({mealPlanerId}) => {
      this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {mealPlanerId}});
    })
  );

  @Effect({dispatch: false})
  setLocalStorageForActiveMealPlaner$ = this.actions$.pipe(
    ofType(
      MealPlanerEffectActions.setActiveMealPlaner,
      MealPlanerContainerActions.changeSelectedMealPlaner,
    ),
    tap(({mealPlanerId}) => {
      this.storageService.setItem('selectedMealPlanerId', mealPlanerId);
    })
  );

  @Effect()
  createMealPlaner$ = this.actions$.pipe(
    ofType(
      MealPlanerContainerActions.createMealPlaner,
      MealPlanerEffectActions.retryCreateMealPlaner
    ),
    concatMap(({title}) => this.mealPlanerService.createMealPlaner(title).pipe(
      map((mealPlaner) => {
        return MealPlanerApiActions.createMealPlanerSuccess({mealPlaner});
      }),
      catchError(() => of(MealPlanerApiActions.createMealPlanerFailure({title})))
    )),
  );

  @Effect()
  retryCreateMealPlaner$ = this.actions$.pipe(
    ofType(MealPlanerApiActions.createMealPlanerFailure),
    switchMap(({title}) => {
      return this.snackBarService.openSnackBar('backend-failed.error-message', 'backend-failed.retry').afterDismissed().pipe(
        take(1),
        filter(({dismissedByAction}) => dismissedByAction),
        map(({dismissedByAction}) => MealPlanerEffectActions.retryCreateMealPlaner({title}))
      );
    }),
  );

  @Effect()
  editMealPlaner$ = this.actions$.pipe(
    ofType(
      MealPlanerContainerActions.editMealPlaner,
      MealPlanerEffectActions.retryEditMealPlaner
    ),
    concatMap(({changes, mealPlaner}) => this.mealPlanerService.updateMealPlaner(changes).pipe(
      map(() => {
        return MealPlanerApiActions.editMealPlanerSuccess({mealPlaner: changes});
      }),
      catchError(() => of(MealPlanerApiActions.editMealPlanerFailure({changes, mealPlaner})))
    )),
  );

  @Effect()
  retryEditMealPlaner$ = this.actions$.pipe(
    ofType(MealPlanerApiActions.editMealPlanerFailure),
    switchMap(({changes, mealPlaner}) => {
      return this.snackBarService.openSnackBar('backend-failed.error-message', 'backend-failed.retry').afterDismissed().pipe(
        take(1),
        map(({dismissedByAction}) => {
          return dismissedByAction ?
            MealPlanerEffectActions.retryEditMealPlaner({changes, mealPlaner}) :
            MealPlanerEffectActions.undoOptimisticEditMealPlaner({mealPlaner});
        }));
    }),
  );

  @Effect()
  deleteMealPlaner$ = this.actions$.pipe(
    ofType(
      MealPlanerContainerActions.deleteMealPlaner,
      MealPlanerEffectActions.retryDeleteMealPlaner
    ),
    concatMap(({type, mealPlaner}) => {
      return of({}).pipe(
        delayWhen((action) =>
          (type !== MealPlanerEffectActions.retryDeleteMealPlaner.type) ? interval(DELETION_DELAY) : interval(0)
        ),
        takeUntil(this.actions$.pipe(ofType(MealPlanerContainerActions.undoDeleteMealPlaner))),
        mergeMap(() => this.mealPlanerService.deleteMealPlaner(mealPlaner.id).pipe(
          map(() => {
            return MealPlanerApiActions.deleteMealPlanerSuccess({mealPlaner});
          }),
          catchError(() => of(MealPlanerApiActions.deleteMealPlanerSuccess({mealPlaner})))
        ))
      );
    })
  );


  @Effect()
  retryDeleteMealPlaner$ = this.actions$.pipe(
    ofType(MealPlanerApiActions.deleteMealPlanerSuccess),
    switchMap(({mealPlaner}) => {
      return this.snackBarService.openSnackBar('backend-failed.error-message', 'backend-failed.retry').afterDismissed().pipe(
        take(1),
        map(({dismissedByAction}) => {
          console.log(dismissedByAction);
          return dismissedByAction ?
            MealPlanerEffectActions.retryDeleteMealPlaner({mealPlaner}) :
            MealPlanerEffectActions.undoOptimisticDeleteMealPlaner({mealPlaner});
        }));
    }),
  );

  @Effect()
  changeMealPlanerIfCurrentGetsDeleted$ = this.actions$.pipe(
    ofType(MealPlanerContainerActions.deleteMealPlaner),
    withLatestFrom(this.store),
    filter(([{mealPlaner}, store]) => mealPlaner.id === store.mealPlanerState.activeMealPlaner),
    map(([_, store]) => {
      const idOfFirstMealPlaner = Object.keys(store.mealPlanerState.mealPlaners.entities)[0];
      return MealPlanerEffectActions.setActiveMealPlaner({mealPlanerId: idOfFirstMealPlaner});
    })
  );

  /*@Effect()
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
      catchError(() => of(ShoppingListApiActions.addShoppingListItemFailure({optimisticId, shoppingListItem})))
    )),
  );

  @Effect()
  retryAddShoppingListItem$ = this.actions$.pipe(
    ofType(ShoppingListApiActions.addShoppingListItemFailure),
    switchMap(({optimisticId, shoppingListItem}) => {
      return this.snackBarService.openSnackBar('backend-failed.error-message', 'backend-failed.retry').afterDismissed().pipe(
        take(1),
        map(({dismissedByAction}) => {
          console.log(dismissedByAction);
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
    concatMap(({type, shoppingListItem}) => {
      return of({}).pipe(
        delayWhen((action) =>
          (type !== ShoppingListEffectActions.retryDeleteShoppingListItem.type) ? interval(DELETION_DELAY) :  interval(0)
        ),
        takeUntil(this.actions$.pipe(ofType(ShoppingListContainerActions.undoDeleteShoppingListItem))),
        mergeMap(() => this.shoppingListService.deleteShoppingListItem(shoppingListItem.id).pipe(
          map(() => {
            return ShoppingListApiActions.deleteShoppingListItemSuccess({shoppingListItem});
          }),
          catchError(() => of(ShoppingListApiActions.deleteShoppingListItemFailure({shoppingListItem})))
        )),
      );
    })
  );

  @Effect()
  retryDeleteShoppingListItem$ = this.actions$.pipe(
    ofType(ShoppingListApiActions.deleteShoppingListItemFailure),
    switchMap(({shoppingListItem}) => {
      return this.snackBarService.openSnackBar('backend-failed.error-message', 'backend-failed.retry').afterDismissed().pipe(
        take(1),
        map(({dismissedByAction}) => {
          console.log(dismissedByAction);
          return dismissedByAction ?
            ShoppingListEffectActions.retryDeleteShoppingListItem({shoppingListItem}) :
            ShoppingListEffectActions.undoOptimisticDeleteShoppingListItem({shoppingListItem});
        })
      );
    }),
  );
  */
}
