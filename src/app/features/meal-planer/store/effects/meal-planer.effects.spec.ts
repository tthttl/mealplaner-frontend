import { Observable, of, throwError } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { MealPlanerService } from '../../services/meal-planer.service';
import SpyObj = jasmine.SpyObj;
import { MealPlanersEffects } from './meal-planers.effects';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalState, initialState, selectUserID } from '../../../../core/store';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { StorageService } from '../../../../core/services/storage.service';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialMealPlanerState } from '../state/meal-planer-state';
import { MealPlanerApiActions, MealPlanerContainerActions, MealPlanerEffectActions } from '../actions';
import { Meal, MealPlaner } from '../../../../core/models/model';
import { STORAGE_SELECTED_MEAL_PLANER_ID } from '../../../../core/constants/constants';


describe('Meal Planer Effects', () => {
  let actions$: Observable<Action>;
  let mealPlanerService: SpyObj<MealPlanerService>;
  let mealPlanerEffects: MealPlanersEffects;
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let store: Store<GlobalState>;
  let snackBarService: SpyObj<SnackbarService>;
  let storageService: SpyObj<StorageService>;

  class StoreMock {
    select = jasmine.createSpy().and.returnValue(of({}));
    dispatch = jasmine.createSpy();
    pipe = jasmine.createSpy().and.returnValue(of('success'));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {queryParams: {}}
          }
        },
        {
          provide: Store,
          useClass: StoreMock
        },
        provideMockStore({
          selectors: [
            {selector: selectUserID, value: '32'},
          ],
          initialState: {
            ...initialState,
            mealPlanerState: {
              ...initialMealPlanerState,
              activeMealPlaner: '42',
              mealPlaners: {
                ids: ['42', '99'],
                entities: {
                  42: {id: '42', title: 'Title 42'},
                  99: {id: '99', title: 'Title 99'}
                }
              },
              meals: {
                42: {
                  '2021-01-01': {breakfast: [], lunch: [], dinner: []}
                }
              }
            }
          }
        }),
      ]
    });

    store = TestBed.inject(Store);
    activatedRoute = TestBed.inject(ActivatedRoute);
    router = jasmine.createSpyObj('Router', ['navigate']);
    snackBarService = jasmine.createSpyObj('SnackBarService', ['openSnackBar']);
    storageService = jasmine.createSpyObj('StorageService', ['getItem', 'setItem']);
  });

  function createEffect(actions: Observable<Action>, service: MealPlanerService, routerMock: Router = router): MealPlanersEffects {
    return new MealPlanersEffects(actions, service, activatedRoute, routerMock, storageService, snackBarService, store);
  }

  describe('getMealPlaners$', () => {
    beforeEach(() => {
      mealPlanerService = jasmine.createSpyObj('mealPlanerService', ['getMealPlaners']);
      actions$ = of({type: MealPlanerContainerActions.loadMealPlaners.type});
      mealPlanerEffects = createEffect(actions$, mealPlanerService);
    });

    it('it should return action', () => {
      mealPlanerService.getMealPlaners.and.returnValue(of([] as MealPlaner[]));
      mealPlanerEffects.getMealPlaners$.subscribe((action: Action) => {
        expect(action.type).toEqual(MealPlanerApiActions.loadMealPlanersSuccess.type);
      });
    });

    it('should return failure action', () => {
      mealPlanerService.getMealPlaners.and.returnValue(throwError('error'));
      mealPlanerEffects.getMealPlaners$.subscribe((action: Action) => {
        expect(action.type).toEqual(MealPlanerApiActions.loadMealPlanersFailure.type);
      });
    });
  });


  describe('chooseCurrentMealPlaner$', () => {
    beforeEach(() => {
      mealPlanerService = jasmine.createSpyObj('', ['']);
      actions$ = of({
        type: MealPlanerApiActions.loadMealPlanersSuccess.type,
        mealPlaners: [{id: '42', title: 'Test List 1'}, {id: '43', title: 'Test List 2'}]
      });
    });

    it('it should  chose first meal planer by default', () => {
      mealPlanerEffects = createEffect(actions$, mealPlanerService);
      mealPlanerEffects.chooseCurrentMealPlaner$.subscribe((action) => {
        expect(action.type).toEqual(MealPlanerEffectActions.setActiveMealPlaner.type);
        expect(action.mealPlanerId).toEqual('42');
      });
    });

    it('it should  chose requested meal planer in query params if it exists', () => {
      activatedRoute.snapshot.queryParams.mealPlanerId = '43';
      mealPlanerEffects = createEffect(actions$, mealPlanerService);
      mealPlanerEffects.chooseCurrentMealPlaner$.subscribe((action) => {
        expect(action.type).toEqual(MealPlanerEffectActions.setActiveMealPlaner.type);
        expect(action.mealPlanerId).toEqual('43');
      });
    });

    it('it should  chose requested meal planer in local storage if it exists', () => {
      storageService.getItem.and.returnValue('43');
      mealPlanerEffects = createEffect(actions$, mealPlanerService);
      mealPlanerEffects.chooseCurrentMealPlaner$.subscribe((action) => {
        expect(action.type).toEqual(MealPlanerEffectActions.setActiveMealPlaner.type);
        expect(action.mealPlanerId).toEqual('43');
      });
    });

    it('it should chose first meal planer if requested id in query params and local storage does not exists', () => {
      activatedRoute.snapshot.queryParams.shoppingListId = '98';
      spyOn(localStorage, 'getItem').and.callFake(() => '99');
      mealPlanerEffects = createEffect(actions$, mealPlanerService);
      mealPlanerEffects.chooseCurrentMealPlaner$.subscribe((action) => {
        expect(action.type).toEqual(MealPlanerEffectActions.setActiveMealPlaner.type);
        expect(action.mealPlanerId).toEqual('42');
      });
    });
  });

  describe('setQueryParameterForActiveMealPlaner$', () => {
    beforeEach(() => {
      mealPlanerService = jasmine.createSpyObj('', ['']);
      router = jasmine.createSpyObj('Router', ['navigate'], {routerState: {snapshot: {url: 'meal-planer'}}});
    });

    it('it should  set query parameters after delegated MealPlanerEffectActions', () => {
      actions$ = of({
        type: MealPlanerEffectActions.setActiveMealPlaner.type,
        mealPlanerId: '42',
      });
      mealPlanerEffects = createEffect(actions$, mealPlanerService, router);
      mealPlanerEffects.setQueryParameterForActiveMealPlaner$.subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith([], {relativeTo: activatedRoute, queryParams: {mealPlanerId: '42'}});
      });
    });

    it('it should  set query parameters after delegated MealPlanerContainerActions', () => {
      actions$ = of({
        type: MealPlanerContainerActions.changeSelectedMealPlaner.type,
        mealPlanerId: '42',
      });
      mealPlanerEffects = createEffect(actions$, mealPlanerService, router);
      mealPlanerEffects.setQueryParameterForActiveMealPlaner$.subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith([], {relativeTo: activatedRoute, queryParams: {mealPlanerId: '42'}});
      });
    });
  });

  describe('setLocalStorageForActiveMealPlaner$', () => {

    it('it should  set local storage parameters after delegated ShoppingListEffectActions', () => {
      actions$ = of({
        type: MealPlanerEffectActions.setActiveMealPlaner.type,
        mealPlanerId: '42',
      });
      mealPlanerEffects = createEffect(actions$, mealPlanerService, router);
      mealPlanerEffects.setLocalStorageForActiveMealPlaner$.subscribe(() => {
        expect(storageService.setItem).toHaveBeenCalledWith(STORAGE_SELECTED_MEAL_PLANER_ID, '42');
      });
    });

    it('it should  set local storage parameters after delegated MealPlanerContainerActions', () => {
      actions$ = of({
        type: MealPlanerEffectActions.setActiveMealPlaner.type,
        mealPlanerId: '42',
      });
      mealPlanerEffects = createEffect(actions$, mealPlanerService, router);
      mealPlanerEffects.setLocalStorageForActiveMealPlaner$.subscribe(() => {
        expect(storageService.setItem).toHaveBeenCalledWith(STORAGE_SELECTED_MEAL_PLANER_ID, '42');
      });
    });
  });

  describe('createMealPlaner$', () => {
    beforeEach(() => {
      actions$ = of({type: MealPlanerContainerActions.createMealPlaner.type});
      mealPlanerService = jasmine.createSpyObj('mealPlanerService', ['createMealPlaner']);
      mealPlanerEffects = createEffect(actions$, mealPlanerService, router);
    });

    it('it should return success action', () => {
      mealPlanerService.createMealPlaner.and.returnValue(of({} as MealPlaner));
      mealPlanerEffects.createMealPlaner$.subscribe((action: Action) => {
        expect(action.type).toEqual(MealPlanerApiActions.createMealPlanerSuccess.type);
      });
    });

    it('should return failure action', () => {
      mealPlanerService.createMealPlaner.and.returnValue(throwError('error'));
      mealPlanerEffects.createMealPlaner$.subscribe((action: Action) => {
        expect(action.type).toEqual(MealPlanerApiActions.createMealPlanerFailure.type);
      });
    });
  });

  describe('editMealPlaner$', () => {
    beforeEach(() => {
      actions$ = of({type: MealPlanerContainerActions.editMealPlaner.type});
      mealPlanerService = jasmine.createSpyObj('mealPlanerService', ['updateMealPlaner']);
      mealPlanerEffects = createEffect(actions$, mealPlanerService, router);
    });

    it('it should return success action', () => {
      mealPlanerService.updateMealPlaner.and.returnValue(of({} as MealPlaner));
      mealPlanerEffects.editMealPlaner$.subscribe((action: Action) => {
        expect(action.type).toEqual(MealPlanerApiActions.editMealPlanerSuccess.type);
      });
    });

    it('should return failure action', () => {
      mealPlanerService.updateMealPlaner.and.returnValue(throwError('error'));
      mealPlanerEffects.editMealPlaner$.subscribe((action: Action) => {
        expect(action.type).toEqual(MealPlanerApiActions.editMealPlanerFailure.type);
      });
    });
  });

  describe('deleteMealPlaner$', () => {
    beforeEach(() => {
      actions$ = of({type: MealPlanerEffectActions.retryDeleteMealPlaner.type, mealPlaner: {id: '42', title: 'TEST'}});
      mealPlanerService = jasmine.createSpyObj('mealPlanerService', ['deleteMealPlaner']);
      mealPlanerEffects = createEffect(actions$, mealPlanerService, router);
    });

    it('it should return success action', () => {
      mealPlanerService.deleteMealPlaner.and.returnValue(of({DELETED: true}));
      mealPlanerEffects.deleteMealPlaner$.subscribe((action: Action) => {
        expect(action.type).toEqual(MealPlanerApiActions.deleteMealPlanerSuccess.type);
      });
    });

    it('should return failure action', () => {
      mealPlanerService.deleteMealPlaner.and.returnValue(throwError('error'));
      mealPlanerEffects.deleteMealPlaner$.subscribe((action: Action) => {
        expect(action.type).toEqual(MealPlanerApiActions.deleteMealPlanerFailure.type);
      });
    });
  });


  describe('getMeal$', () => {
    beforeEach(() => {
      actions$ = of({type: MealPlanerEffectActions.setActiveMealPlaner.type});
      mealPlanerService = jasmine.createSpyObj('mealPlanerService', ['loadMealsByDay']);
      mealPlanerEffects = createEffect(actions$, mealPlanerService, router);
    });

    it('it should return success action', () => {
      mealPlanerService.loadMealsByDay.and.returnValue(of([] as Meal[]));
      mealPlanerEffects.getMeal$.subscribe((action: Action) => {
        expect(action.type).toEqual(MealPlanerApiActions.loadMealsSuccess.type);
      });
    });

    it('should return failure action', () => {
      mealPlanerService.loadMealsByDay.and.returnValue(throwError('error'));
      mealPlanerEffects.getMeal$.subscribe((action: Action) => {
        expect(action.type).toEqual(MealPlanerApiActions.loadMealPlanersFailure.type);
      });
    });
  });

  describe('addMeal$', () => {
    beforeEach(() => {
      actions$ = of({type: MealPlanerEffectActions.setActiveMealPlaner.type});
      mealPlanerService = jasmine.createSpyObj('mealPlanerService', ['addMeal']);
      mealPlanerEffects = createEffect(actions$, mealPlanerService, router);
    });

    it('it should return success action', () => {
      mealPlanerService.addMeal.and.returnValue(of({} as Meal));
      mealPlanerEffects.addMeal$.subscribe((action: Action) => {
        expect(action.type).toEqual(MealPlanerApiActions.addMealsSuccess.type);
      });
    });

    it('should return failure action', () => {
      mealPlanerService.addMeal.and.returnValue(throwError('error'));
      mealPlanerEffects.addMeal$.subscribe((action: Action) => {
        expect(action.type).toEqual(MealPlanerApiActions.addMealsFailure.type);
      });
    });
  });

  describe('removeMeal$', () => {
    beforeEach(() => {
      actions$ = of({type: MealPlanerEffectActions.setActiveMealPlaner.type});
      mealPlanerService = jasmine.createSpyObj('mealPlanerService', ['removeMeal']);
      mealPlanerEffects = createEffect(actions$, mealPlanerService, router);
    });

    it('it should return success action', () => {
      mealPlanerService.removeMeal.and.returnValue(of({DELETED: true}));
      mealPlanerEffects.removeMeal$.subscribe((action: Action) => {
        expect(action.type).toEqual(MealPlanerApiActions.removeMealsSuccess.type);
      });
    });

    it('should return failure action', () => {
      mealPlanerService.removeMeal.and.returnValue(throwError('error'));
      mealPlanerEffects.removeMeal$.subscribe((action: Action) => {
        expect(action.type).toEqual(MealPlanerApiActions.removeMealsFailure.type);
      });
    });
  });
});
