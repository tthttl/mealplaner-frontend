import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Recipe } from '../../../core/models/model';

@Injectable()
export class RecipeService {
  constructor(private httpClient: HttpClient) {
  }

  loadRecipes(cookBookId: string): Observable<Recipe[]> {
    return this.httpClient.get<Recipe[]>(`${environment.apiUrl}/recipes?cookbook=${cookBookId}&_sort=title:asc`);
  }

  loadRecipe(recipeId: string): Observable<Recipe> {
    return this.httpClient.get<Recipe>(`${environment.apiUrl}/recipes/${recipeId}`);
  }

  saveRecipe(cookBookId: string, recipe: Recipe): Observable<Recipe> {
    return this.httpClient.post<Recipe>(`${environment.apiUrl}/recipes`, {...recipe, cookbook: cookBookId});
  }

  editRecipe(cookBookId: string, recipe: Recipe): Observable<Recipe> {
    return this.httpClient.put<Recipe>(`${environment.apiUrl}/recipes/${recipe.id}`, {...recipe, cookbook: cookBookId});
  }

  deleteRecipe(recipeId: string): Observable<boolean> {
    return this.httpClient.delete<{ DELETED: boolean }>(`${environment.apiUrl}/recipes/${recipeId}`)
      .pipe(map((result: { DELETED: boolean }) => result.DELETED));
  }
}
