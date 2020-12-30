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
import { DayPlan, Meal, MealPlaner } from '../../../../core/models/model';
import { interval, of } from 'rxjs';
import { DELETION_DELAY, STORAGE_SELECTED_MEAL_PLANER_ID } from '../../../../core/constants/constants';
import { StorageService } from '../../../../core/services/storage.service';
import { stringBetweenChars } from '../../../../core/helpers/helpers';

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
    filter(() => stringBetweenChars(this.router.routerState.snapshot.url, '/', '?') === 'meal-planer'),
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
      this.storageService.setItem(STORAGE_SELECTED_MEAL_PLANER_ID, mealPlanerId);
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
          catchError(() => of(MealPlanerApiActions.deleteMealPlanerFailure({mealPlaner})))
        ))
      );
    })
  );


  @Effect()
  retryDeleteMealPlaner$ = this.actions$.pipe(
    ofType(MealPlanerApiActions.deleteMealPlanerFailure),
    switchMap(({mealPlaner}) => {
      return this.snackBarService.openSnackBar('backend-failed.error-message', 'backend-failed.retry').afterDismissed().pipe(
        take(1),
        map(({dismissedByAction}) => {
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

  @Effect()
  getMeal$ = this.actions$.pipe(
    ofType(
      MealPlanerEffectActions.setActiveMealPlaner,
      MealPlanerContainerActions.changeSelectedMealPlaner,
      MealPlanerContainerActions.selectedDateChanged,
    ),
    withLatestFrom(this.store),
    map(([_, store]) => {
      const {activeMealPlaner, selectedDate} = store.mealPlanerState;
      return {activeMealPlaner, selectedDate};
    }),
    filter(({activeMealPlaner}) => !!activeMealPlaner),
    exhaustMap(({activeMealPlaner, selectedDate}) => {
      const activeMealPlanerId = activeMealPlaner || ''; // activeMealPlaner has always a value here
      return this.mealPlanerService.loadMealsByDay(activeMealPlanerId, selectedDate).pipe(
        map((meals: Meal[]) => {
          return meals.reduce((dayPlan, meal) => {
            if (!dayPlan.hasOwnProperty(meal.type)) {
              dayPlan[meal.type] = [meal];
            } else {
              dayPlan[meal.type].push(meal);
            }
            return dayPlan;
          }, {} as DayPlan);
        }),
        map((dayPlan: DayPlan) => {
          return MealPlanerApiActions.loadMealsSuccess({mealPlanerId: activeMealPlanerId, date: selectedDate, dayPlan});
        }),
        catchError(() => of(MealPlanerApiActions.loadMealPlanersFailure)),
      );
    })
  );

  @Effect()
  addMeal$ = this.actions$.pipe(
    ofType(MealPlanerContainerActions.addMeal, MealPlanerEffectActions.retryAddMeal),
    withLatestFrom(this.store.select('mealPlanerState')),
    concatMap(([action, state]) => {
      return this.mealPlanerService.addMeal(action.mealType, state.selectedDate, state.activeMealPlaner || '', action.recipe.id || '').pipe(
        map((mealApi: Meal) => {
          return MealPlanerApiActions.addMealsSuccess({mealApi, optimisticId: action.optimisticId});
        }),
        catchError(() => {
          return of(MealPlanerApiActions.addMealsFailure(
            {mealType: action.mealType, recipe: action.recipe, optimisticId: action.optimisticId}
          ));
        })
      );
    }),
  );

  @Effect()
  retryAndMeal$ = this.actions$.pipe(
    ofType(MealPlanerApiActions.addMealsFailure),
    switchMap(({mealType, recipe, optimisticId}) => {
      return this.snackBarService.openSnackBar('backend-failed.error-message', 'backend-failed.retry').afterDismissed().pipe(
        take(1),
        map(({dismissedByAction}) => {
          return dismissedByAction ?
            MealPlanerEffectActions.retryAddMeal({mealType, recipe, optimisticId}) :
            MealPlanerEffectActions.undoOptimisticAddMeal({mealType, optimisticId});
        }));
    }),
  );

  @Effect()
  removeMeal$ = this.actions$.pipe(
    ofType(MealPlanerContainerActions.removeMeal, MealPlanerEffectActions.retryRemoveMeal),
    concatMap(({type, meal}) => {
      return of({}).pipe(
        delayWhen((action) =>
          (type === MealPlanerContainerActions.removeMeal.type) ? interval(DELETION_DELAY) : interval(0)
        ),
        takeUntil(this.actions$.pipe(ofType(MealPlanerContainerActions.undoDeleteMealPlaner))),
        concatMap(() => {
          return this.mealPlanerService.removeMeal(meal).pipe(
            map(() => {
              return MealPlanerApiActions.removeMealsSuccess();
            }),
            catchError(() => of(MealPlanerApiActions.removeMealsFailure({meal})))
          );
        })
      );
    }),
  );

  @Effect()
  retryRemoveMeal$ = this.actions$.pipe(
    ofType(MealPlanerApiActions.removeMealsFailure),
    switchMap(({meal}) => {
      return this.snackBarService.openSnackBar('backend-failed.error-message', 'backend-failed.retry').afterDismissed().pipe(
        take(1),
        map(({dismissedByAction}) => {
          return dismissedByAction ?
            MealPlanerEffectActions.retryRemoveMeal({meal}) :
            MealPlanerEffectActions.undoOptimisticRemoveMeal({meal});
        }));
    }),
  );
}
