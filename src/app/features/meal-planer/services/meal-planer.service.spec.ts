import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MealPlaner } from '../../../core/models/model';
import { environment } from '../../../../environments/environment';
import { MealPlanerService } from './meal-planer.service';

describe('MealPlanerService', () => {
  let injector: TestBed;
  let service: MealPlanerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MealPlanerService],
    });

    injector = getTestBed();
    service = injector.inject(MealPlanerService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('getMealPlaners() should return array of meal planers', () => {
    const mockMealPlaners: MealPlaner[] = [
      {id: '42', title: 'My Meal Planer'},
      {id: '50', title: 'My Second Planer'},
    ];

    service.getMealPlaners('userid').subscribe((res) => {
      expect(res).toEqual(mockMealPlaners);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/mealplaners?user=userid`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMealPlaners);
  });

  it('createMealPlaner() should return new meal planer', () => {
    service.createMealPlaner('Test').subscribe((res) => {
      expect(res).toEqual({id: '42', title: 'Test'});
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/mealplaners`);
    expect(req.request.method).toBe('POST');
    req.flush({id: '42', title: 'Test'});
  });

  it('updateMealPlaner() should return meal planer', () => {
    const mealPlaner: MealPlaner = {
      id: 'mealPlanerId', title: 'List'
    };

    service.updateMealPlaner(mealPlaner).subscribe((res) => {
      expect(res).toEqual(mealPlaner);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/mealplaners/mealPlanerId`);
    expect(req.request.method).toBe('PUT');
    req.flush(mealPlaner);
  });

  it('deleteMealPlaner() should return success message', () => {
    service.deleteMealPlaner('mealPlanerId').subscribe((res) => {
      expect(res).toEqual({DELETED: true});
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/mealplaners/mealPlanerId`);
    expect(req.request.method).toBe('DELETE');
    req.flush({DELETED: true});
  });

  /*it('getShoppingListItems() should return array of shopping list items', () => {
    const mockShoppingLists: ShoppingListItem[] = [
      {id: '42', title: 'Apple', amount: 1, unit: 'kg', shoppingList: '32', order: 2},
      {id: '42', title: 'Banana', amount: 1, unit: 'kg', shoppingList: '32', order: 1},
    ];

    service.getShoppingListItems('shoppingListId').subscribe((res) => {
      expect(res).toEqual(mockShoppingLists);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/shopping-list-items?shoppingList=shoppingListId`);
    expect(req.request.method).toBe('GET');
    req.flush(mockShoppingLists);
  });

  it('addShoppingListItem() should return item with backend id', () => {
    const shoppingListItem: BasicShoppingListItem = {
      title: 'Apple', amount: 1, unit: 'kg', shoppingList: '32',
    };

    service.addShoppingListItem(shoppingListItem).subscribe((res) => {
      expect(res).toEqual({id: '42', ...shoppingListItem});
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/shopping-list-items`);
    expect(req.request.method).toBe('POST');
    req.flush({id: '42', ...shoppingListItem});
  });

  it('updateShoppingListItem() should return item', () => {
    const shoppingListItem: ShoppingListItem = {
      id: 'shoppingListItemId', title: 'Apple', amount: 1, unit: 'kg', shoppingList: '32', order: 2
    };

    service.updateShoppingListItem(shoppingListItem).subscribe((res) => {
      expect(res).toEqual(shoppingListItem);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/shopping-list-items/shoppingListItemId`);
    expect(req.request.method).toBe('PUT');
    req.flush(shoppingListItem);
  });

  it('deleteShoppingListItem() should return success message', () => {
    service.deleteShoppingListItem('shoppingListItemId').subscribe((res) => {
      expect(res).toEqual({DELETED: true});
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/shopping-list-items/shoppingListItemId`);
    expect(req.request.method).toBe('DELETE');
    req.flush({DELETED: true});
  });*/

  afterEach(() => {
    httpMock.verify();
  });
});


