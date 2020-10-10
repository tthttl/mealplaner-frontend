import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { convertRecipeApiToRecipe, convertRecipesApiToRecipes } from '../../shared/helpers/helpers';
import { Recipe } from '../../shared/model/model';
import { RecipeApi } from '../../shared/model/model-api';

@Injectable()
export class RecipeService {
  constructor(private httpClient: HttpClient) {
  }

  loadRecipes(cookBookId: string): Observable<Recipe[]> {
    return this.httpClient.get<RecipeApi[]>(`${environment.apiUrl}/recipes?cookbook=${cookBookId}`).pipe(
      map((recipes: RecipeApi[]) => convertRecipesApiToRecipes(recipes))
    );
  }

  saveRecipe(cookBookId: string, recipe: Recipe): Observable<Recipe> {
    return this.httpClient.post<RecipeApi>(`${environment.apiUrl}/recipes`, {...recipe, cookbook: cookBookId}).pipe(
      map((savedRecipe: RecipeApi) => convertRecipeApiToRecipe(savedRecipe))
    );
  }

  editRecipe(cookBookId: string, recipe: Recipe): Observable<Recipe> {
    return this.httpClient.put<RecipeApi>(`${environment.apiUrl}/recipes/${recipe.id}`, {...recipe, cookbook: cookBookId}).pipe(
      map((editedRecipe: RecipeApi) => convertRecipeApiToRecipe(editedRecipe))
    );
  }

  deleteRecipe(recipeId: string): Observable<string>{
    return this.httpClient.delete(`${environment.apiUrl}/recipes/${recipeId}`, {
      responseType: 'text'
    });
  }
}
