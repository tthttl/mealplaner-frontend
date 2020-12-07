import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MealPlaner } from '../../../core/models/model';

@Injectable({
  providedIn: 'root'
})
export class MealPlanerService {
  constructor(private httpClient: HttpClient) {}

  getMealPlaners(userId: string): Observable<MealPlaner[]> {
    return this.httpClient.get<MealPlaner[]>(`${environment.apiUrl}/mealplaners?user=${userId}`);
  }

  createMealPlaner(title: string): Observable<MealPlaner> {
    return this.httpClient.post<MealPlaner>(`${environment.apiUrl}/mealplaners`, {title});
  }

  updateMealPlaner(mealPlaner: MealPlaner): Observable<MealPlaner> {
    return this.httpClient.put<MealPlaner>(`${environment.apiUrl}/mealplaners/${mealPlaner.id}`, {title: mealPlaner.title});
  }

  deleteMealPlaner(mealPlanerId: string): Observable<{ DELETED: true }> {
    return this.httpClient.delete<{ DELETED: true }>(`${environment.apiUrl}/mealplaners/${mealPlanerId}`);
  }

  /*getShoppingListItems(shoppingListId: string): Observable<ShoppingListItem[]> {
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
  }*/
}

