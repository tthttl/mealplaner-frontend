import { getTestBed, TestBed } from '@angular/core/testing';
import { ShoppingListService } from './shopping-list.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ShoppingList, ShoppingListItem } from '../../shared/model/model';
import { environment } from '../../../environments/environment';

describe('ShoppingListService', () => {
  let injector: TestBed;
  let service: ShoppingListService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ShoppingListService],
    });

    injector = getTestBed();
    service = injector.inject(ShoppingListService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('getShoppingLists() should return array of shopping lists', () => {
    const mockShoppingLists: ShoppingList[] = [
      {id: '42', title: 'My Shopping List'},
      {id: '50', title: 'My Second Shopping List'},
    ];

    service.getShoppingLists('userid').subscribe((res) => {
      expect(res).toEqual(mockShoppingLists);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/shopping-lists?user=userid`);
    expect(req.request.method).toBe('GET');
    req.flush(mockShoppingLists);
  });

  it('getShoppingListItems() should return array of shopping list items', () => {
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
    const shoppingListItem: ShoppingListItem = {
      title: 'Apple', amount: 1, unit: 'kg', shoppingList: '32', order: 2
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
  });


  afterEach(() => {
    httpMock.verify();
  });
});


