import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { convertRecipesApiToRecipes } from '../../shared/helpers/helpers';
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
}
