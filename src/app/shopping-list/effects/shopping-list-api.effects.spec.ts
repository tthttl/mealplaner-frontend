import { ShoppingListService } from '../service/shopping-list.service';
import { ShoppingListApiEffects } from './shopping-list-api.effects';
import { ShoppingListApiActions, ShoppingListContainerActions, ShoppingListEffectActions } from '../actions';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalState, selectCurrentShoppingListItems, selectUserID } from '../../shared/state';
import { ShoppingList, ShoppingListItem } from '../../shared/model/model';
import SpyObj = jasmine.SpyObj;


describe('Shopping List Api Effects', () => {
  let actions$: Observable<Action>;
  let shoppingListService: SpyObj<ShoppingListService>;
  let shoppingListApiEffects: ShoppingListApiEffects;
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let store: Store<GlobalState>;

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
            {
              selector: selectCurrentShoppingListItems,
              value: [
                {id: '42', title: 'Item 1', order: 4},
                {id: '42', title: 'Item 2', order: 3},
                {id: '42', title: 'Item 3', order: 2},
                {id: '42', title: 'Item 4', order: 1},
              ]
            }
          ],
        }),
      ]
    });

    store = TestBed.inject(Store);
    activatedRoute = TestBed.inject(ActivatedRoute);
    router = jasmine.createSpyObj('Router', ['navigate']);
  });

  describe('getShoppingLists$', () => {
    beforeEach(() => {
      shoppingListService = jasmine.createSpyObj('shoppingListService', ['getShoppingLists']);
      actions$ = of({type: ShoppingListContainerActions.loadShoppingLists.type});
      shoppingListApiEffects = new ShoppingListApiEffects(actions$, shoppingListService, activatedRoute, router, store);
    });

    it('it should return action', () => {
      shoppingListService.getShoppingLists.and.returnValue(of([] as ShoppingList[]));
      shoppingListApiEffects.getShoppingLists$.subscribe((action: Action) => {
        expect(action.type).toEqual(ShoppingListApiActions.loadShoppingListsSuccess.type);
      });
    });

    it('should return failure action', () => {
      shoppingListService.getShoppingLists.and.returnValue(throwError('error'));
      shoppingListApiEffects.getShoppingLists$.subscribe((action: Action) => {
        expect(action.type).toEqual(ShoppingListApiActions.loadShoppingListsFailure.type);
      });
    });
  });


  describe('chooseCurrentShoppingList$', () => {
    beforeEach(() => {
      shoppingListService = jasmine.createSpyObj('', ['']);
      actions$ = of({
        type: ShoppingListApiActions.loadShoppingListsSuccess.type,
        shoppingLists: [{id: '42', title: 'Test List 1'}, {id: '43', title: 'Test List 2'}]
      });
    });

    it('it should  chose first shopping list by default', () => {
      shoppingListApiEffects = new ShoppingListApiEffects(actions$, shoppingListService, activatedRoute, router, store);
      shoppingListApiEffects.chooseCurrentShoppingList$.subscribe((action) => {
        expect(action.type).toEqual(ShoppingListEffectActions.setActiveShoppingList.type);
        expect(action.shoppingListId).toEqual('42');
      });
    });

    it('it should  chose requested shopping list in query params if it exists', () => {
      activatedRoute.snapshot.queryParams.shoppingListId = '43';
      shoppingListApiEffects = new ShoppingListApiEffects(actions$, shoppingListService, activatedRoute, router, store);
      shoppingListApiEffects.chooseCurrentShoppingList$.subscribe((action) => {
        expect(action.type).toEqual(ShoppingListEffectActions.setActiveShoppingList.type);
        expect(action.shoppingListId).toEqual('43');
      });
    });

    it('it should  chose requested shopping list in local storage if it exists', () => {
      spyOn(localStorage, 'getItem').and.callFake(() => '43');
      shoppingListApiEffects = new ShoppingListApiEffects(actions$, shoppingListService, activatedRoute, router, store);
      shoppingListApiEffects.chooseCurrentShoppingList$.subscribe((action) => {
        expect(action.type).toEqual(ShoppingListEffectActions.setActiveShoppingList.type);
        expect(action.shoppingListId).toEqual('43');
      });
    });

    it('it should chose first shopping list if requested id in query params and local storage does not exists', () => {
      activatedRoute.snapshot.queryParams.shoppingListId = '98';
      spyOn(localStorage, 'getItem').and.callFake(() => '99');
      shoppingListApiEffects = new ShoppingListApiEffects(actions$, shoppingListService, activatedRoute, router, store);
      shoppingListApiEffects.chooseCurrentShoppingList$.subscribe((action) => {
        expect(action.type).toEqual(ShoppingListEffectActions.setActiveShoppingList.type);
        expect(action.shoppingListId).toEqual('42');
      });
    });
  });


  describe('setQueryParameterForActiveShoppingList$', () => {
    beforeEach(() => {
      shoppingListService = jasmine.createSpyObj('', ['']);
      router = jasmine.createSpyObj('Router', ['navigate']);
    });

    it('it should  set query parameters after delegated ShoppingListEffectActions', () => {
      actions$ = of({
        type: ShoppingListEffectActions.setActiveShoppingList.type,
        shoppingListId: '42',
      });
      shoppingListApiEffects = new ShoppingListApiEffects(actions$, shoppingListService, activatedRoute, router, store);
      shoppingListApiEffects.setQueryParameterForActiveShoppingList$.subscribe((action) => {
        expect(router.navigate).toHaveBeenCalledWith([], {relativeTo: activatedRoute, queryParams: {shoppingListId: '42'}});
      });
    });

    it('it should  set query parameters after delegated ShoppingListContainerActions', () => {
      actions$ = of({
        type: ShoppingListContainerActions.changeShoppingList.type,
        shoppingListId: '42',
      });
      shoppingListApiEffects = new ShoppingListApiEffects(actions$, shoppingListService, activatedRoute, router, store);
      shoppingListApiEffects.setQueryParameterForActiveShoppingList$.subscribe((action) => {
        expect(router.navigate).toHaveBeenCalledWith([], {relativeTo: activatedRoute, queryParams: {shoppingListId: '42'}});
      });
    });
  });

  describe('setLocalStorageForActiveShoppingList$', () => {
    beforeEach(() => {
      spyOn(localStorage, 'setItem');
    });

    it('it should  set local storage parameters after delegated ShoppingListEffectActions', () => {
      actions$ = of({
        type: ShoppingListEffectActions.setActiveShoppingList.type,
        shoppingListId: '42',
      });
      shoppingListApiEffects = new ShoppingListApiEffects(actions$, shoppingListService, activatedRoute, router, store);
      shoppingListApiEffects.setLocalStorageForActiveShoppingList$.subscribe((action) => {
        expect(localStorage.setItem).toHaveBeenCalledWith('selectedShoppingListId', '42');
      });
    });

    it('it should  set local storage parameters after delegated ShoppingListContainerActions', () => {
      actions$ = of({
        type: ShoppingListContainerActions.changeShoppingList.type,
        shoppingListId: '42',
      });
      shoppingListApiEffects = new ShoppingListApiEffects(actions$, shoppingListService, activatedRoute, router, store);
      shoppingListApiEffects.setLocalStorageForActiveShoppingList$.subscribe((action) => {
        expect(localStorage.setItem).toHaveBeenCalledWith('selectedShoppingListId', '42');
      });
    });
  });

  describe('getShoppingListItems$', () => {
    beforeEach(() => {
      actions$ = of({type: ShoppingListEffectActions.setActiveShoppingList.type});
      shoppingListService = jasmine.createSpyObj('shoppingListService', ['getShoppingListItems']);
      shoppingListApiEffects = new ShoppingListApiEffects(actions$, shoppingListService, activatedRoute, router, store);
    });

    it('it should return success action', () => {
      shoppingListService.getShoppingListItems.and.returnValue(of([] as ShoppingListItem[]));
      shoppingListApiEffects.getShoppingListItems$.subscribe((action: Action) => {
        expect(action.type).toEqual(ShoppingListApiActions.loadShoppingListItemsSuccess.type);
      });
    });

    it('should return failure action', () => {
      shoppingListService.getShoppingListItems.and.returnValue(throwError('error'));
      shoppingListApiEffects.getShoppingListItems$.subscribe((action: Action) => {
        expect(action.type).toEqual(ShoppingListApiActions.loadShoppingListItemsFailure.type);
      });
    });
  });

  describe('addShoppingListItem$', () => {
    beforeEach(() => {
      actions$ = of({type: ShoppingListContainerActions.addShoppingListItem.type});
      shoppingListService = jasmine.createSpyObj('shoppingListService', ['addShoppingListItem']);
      shoppingListApiEffects = new ShoppingListApiEffects(actions$, shoppingListService, activatedRoute, router, store);
    });

    it('it should return success action', () => {
      shoppingListService.addShoppingListItem.and.returnValue(of({} as ShoppingListItem));
      shoppingListApiEffects.addShoppingListItem$.subscribe((action: Action) => {
        expect(action.type).toEqual(ShoppingListApiActions.addShoppingListItemSuccess.type);
      });
    });

    it('should return failure action', () => {
      shoppingListService.addShoppingListItem.and.returnValue(throwError('error'));
      shoppingListApiEffects.addShoppingListItem$.subscribe((action: Action) => {
        expect(action.type).toEqual(ShoppingListApiActions.addShoppingListItemFailure.type);
      });
    });
  });

  describe('deleteShoppingListItem$', () => {
    beforeEach(() => {
      actions$ = of({type: ShoppingListContainerActions.deleteShoppingListItem.type, shoppingListItem: {id: '42'}});
      shoppingListService = jasmine.createSpyObj('shoppingListService', ['deleteShoppingListItem']);
      shoppingListApiEffects = new ShoppingListApiEffects(actions$, shoppingListService, activatedRoute, router, store);
    });

    it('it should return success action', () => {
      shoppingListService.deleteShoppingListItem.and.returnValue(of({} as { 'DELETED': true }));
      shoppingListApiEffects.deleteShoppingListItem$.subscribe((action: Action) => {
        expect(action.type).toEqual(ShoppingListApiActions.deleteShoppingListItemSuccess.type);
      });
    });

    it('should return failure action', () => {
      shoppingListService.deleteShoppingListItem.and.returnValue(throwError('error'));
      shoppingListApiEffects.deleteShoppingListItem$.subscribe((action: Action) => {
        expect(action.type).toEqual(ShoppingListApiActions.deleteShoppingListItemFailure.type);
      });
    });
  });

  describe('moveShoppingListItem$', () => {
    beforeEach(() => {
      shoppingListService = jasmine.createSpyObj('shoppingListService', ['updateShoppingListItem']);
    });

    it('should call service 3 times when moved from Index 0 to 2', () => {
      actions$ = of({
        type: ShoppingListContainerActions.moveShoppingListItem.type,
        shoppingListId: '42',
        previousIndex: 0,
        currentIndex: 2
      });
      shoppingListApiEffects = new ShoppingListApiEffects(actions$, shoppingListService, activatedRoute, router, store);
      shoppingListService.updateShoppingListItem.and.returnValue(of({} as ShoppingListItem));
      shoppingListApiEffects.moveShoppingListItem$.subscribe((action: Action) => {
        expect(shoppingListService.updateShoppingListItem).toHaveBeenCalledTimes(3);
        expect(action.type).toEqual(ShoppingListApiActions.updateShoppingListItemSuccess.type);
      });
    });

    it('should call service 2 times when moved from Index 2 to 1', () => {
      actions$ = of({
        type: ShoppingListContainerActions.moveShoppingListItem.type,
        shoppingListId: '42',
        previousIndex: 2,
        currentIndex: 1
      });
      shoppingListApiEffects = new ShoppingListApiEffects(actions$, shoppingListService, activatedRoute, router, store);
      shoppingListService.updateShoppingListItem.and.returnValue(of({} as ShoppingListItem));
      shoppingListApiEffects.moveShoppingListItem$.subscribe((action: Action) => {
        expect(shoppingListService.updateShoppingListItem).toHaveBeenCalledTimes(2);
        expect(action.type).toEqual(ShoppingListApiActions.updateShoppingListItemSuccess.type);
      });
    });
  });


  describe('createShoppingList$', () => {
    beforeEach(() => {
      actions$ = of({type: ShoppingListContainerActions.createShoppingList.type});
      shoppingListService = jasmine.createSpyObj('shoppingListService', ['createShoppingList']);
      shoppingListApiEffects = new ShoppingListApiEffects(actions$, shoppingListService, activatedRoute, router, store);
    });

    it('it should return success action', () => {
      shoppingListService.createShoppingList.and.returnValue(of({} as ShoppingList));
      shoppingListApiEffects.createShoppingList$.subscribe((action: Action) => {
        expect(action.type).toEqual(ShoppingListApiActions.createShoppingListSuccess.type);
      });
    });

    it('should return failure action', () => {
      shoppingListService.createShoppingList.and.returnValue(throwError('error'));
      shoppingListApiEffects.createShoppingList$.subscribe((action: Action) => {
        expect(action.type).toEqual(ShoppingListApiActions.createShoppingListFailure.type);
      });
    });
  });

  describe('selectNewlyCreatedShoppingList$', () => {
    it('it should return success action', () => {
      actions$ = of({type: ShoppingListApiActions.createShoppingListSuccess.type, shoppingList: {id: '1234', title: 'Testing'}});
      shoppingListApiEffects = new ShoppingListApiEffects(actions$, shoppingListService, activatedRoute, router, store);
      shoppingListApiEffects.selectNewlyCreatedShoppingList$.subscribe((action) => {
        expect(action.type).toEqual(ShoppingListEffectActions.setActiveShoppingList.type);
        expect(action.shoppingListId).toEqual('1234');
      });
    });
  });

  describe('editShoppingList$', () => {
    beforeEach(() => {
      actions$ = of({type: ShoppingListContainerActions.editShoppingList.type});
      shoppingListService = jasmine.createSpyObj('shoppingListService', ['updateShoppingList']);
      shoppingListApiEffects = new ShoppingListApiEffects(actions$, shoppingListService, activatedRoute, router, store);
    });

    it('it should return success action', () => {
      shoppingListService.updateShoppingList.and.returnValue(of({} as ShoppingList));
      shoppingListApiEffects.editShoppingList$.subscribe((action: Action) => {
        expect(action.type).toEqual(ShoppingListApiActions.editShoppingListSuccess.type);
      });
    });

    it('should return failure action', () => {
      shoppingListService.updateShoppingList.and.returnValue(throwError('error'));
      shoppingListApiEffects.editShoppingList$.subscribe((action: Action) => {
        expect(action.type).toEqual(ShoppingListApiActions.editShoppingListFailure.type);
      });
    });
  });
});
