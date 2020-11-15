import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BasicShoppingListItem, ShoppingList, ShoppingListItem } from '../../shared/model/model';
import { ShoppingListItemApi as ShoppingListItemApi } from '../../shared/model/model-api';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  constructor(private httpClient: HttpClient) {
  }

  getShoppingLists(userId: string): Observable<ShoppingList[]> {
    return this.httpClient.get<ShoppingList[]>(`${environment.apiUrl}/shopping-lists?user=${userId}`);
  }

  createShoppingList(title: string): Observable<ShoppingList> {
    return this.httpClient.post<ShoppingList>(`${environment.apiUrl}/shopping-lists`, {title});
  }

  updateShoppingList(shoppingList: ShoppingList): Observable<ShoppingList> {
    return this.httpClient.put<ShoppingList>(`${environment.apiUrl}/shopping-lists/${shoppingList.id}`, {title: shoppingList.title});
  }

  deleteShoppingList(shoppingListId: string): Observable<{ DELETED: true }> {
    return this.httpClient.delete<{ DELETED: true }>(`${environment.apiUrl}/shopping-lists/${shoppingListId}`);
  }

  getShoppingListItems(shoppingListId: string): Observable<ShoppingListItem[]> {
    return this.httpClient.get<ShoppingListItemApi[]>(`${environment.apiUrl}/shopping-list-items?shoppingList=${shoppingListId}`);
  }

  addShoppingListItem(shoppingListItem: BasicShoppingListItem): Observable<ShoppingListItem> {
    return this.httpClient.post<ShoppingListItem>(`${environment.apiUrl}/shopping-list-items`, shoppingListItem);
  }

  updateShoppingListItem(shoppingListItem: ShoppingListItem): Observable<ShoppingListItem> {
    return this.httpClient.put<ShoppingListItem>(`${environment.apiUrl}/shopping-list-items/${shoppingListItem.id}`, shoppingListItem);
  }

  deleteShoppingListItem(shoppingListItemId: string): Observable<{ DELETED: true }> {
    return this.httpClient.delete<{ DELETED: true }>(`${environment.apiUrl}/shopping-list-items/${shoppingListItemId}`);
  }
}

