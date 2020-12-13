import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Meal, MealPlaner, MealType } from '../../../core/models/model';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class MealPlanerService {
  constructor(private httpClient: HttpClient) {
  }

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

  loadMealsByDay(mealPlanerId: string, date: Date): Observable<Meal[]> {
    return this.httpClient.get<Meal[]>(`${environment.apiUrl}/meals/?mealplaner=${mealPlanerId}&date=${format(date, 'yyyy-MM-dd')}`);
  }

  addMeal(type: MealType, date: Date, mealplanerId: string, recipeId: string): Observable<Meal> {
    return this.httpClient.post<Meal>(`${environment.apiUrl}/meals`, {
      type,
      date: format(date, 'yyyy-MM-dd'),
      mealplaner: mealplanerId,
      recipe: recipeId,
    });
  }

  removeMeal(meal: Meal): Observable<{ DELETED: true }> {
    return this.httpClient.delete<{ DELETED: true }>(`${environment.apiUrl}/meals/${meal.id}`);
  }
}

