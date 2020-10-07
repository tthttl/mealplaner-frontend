import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ShoppingListItem } from '../../shared/model/model';
import { GlobalState } from '../../shared/state';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  constructor(private httpClient: HttpClient, private store: Store<GlobalState>) {
  }

  getShoppingListItems(shoppingList: string): Observable<ShoppingListItem[]> {
    return this.httpClient.get<ShoppingListItem[]>(`${environment.apiUrl}/shopping-list-items?shoppingList=${shoppingList}`);
  }
}

