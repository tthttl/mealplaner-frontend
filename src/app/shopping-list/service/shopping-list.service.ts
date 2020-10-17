import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BasicShoppingListItem, ShoppingList, ShoppingListItem } from '../../shared/model/model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  constructor(private httpClient: HttpClient) {
  }

  getShoppingLists(userId: string): Observable<ShoppingList[]> {
    return this.httpClient.get<ShoppingList[]>(`${environment.apiUrl}/shopping-lists?user=${userId}`);
  }

  getShoppingListItems(shoppingListId: string): Observable<ShoppingListItem[]> {
    return this.httpClient.get<ShoppingListItem[]>(`${environment.apiUrl}/shopping-list-items?shoppingList=${shoppingListId}`);
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

