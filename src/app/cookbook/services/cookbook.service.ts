import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { convertCookbookApisToCookbooks, convertCookbookApiToCookbook } from '../../shared/helpers/helpers';
import { Cookbook } from '../../shared/model/model';
import { CookbookApi, RecipeApi } from '../../shared/model/model-api';

@Injectable()
export class CookbookService {
  constructor(private httpClient: HttpClient) {
  }

  loadCookbooks(userId: string): Observable<Cookbook[]> {
    return this.httpClient.get<CookbookApi[]>(`${environment.apiUrl}/cookbooks?user=${userId}`).pipe(
      map((cookbooks: CookbookApi[]) => convertCookbookApisToCookbooks(cookbooks))
    );
  }

  saveCookbook(cookbook: Cookbook): Observable<Cookbook> {
    return this.httpClient.post<CookbookApi>(`${environment.apiUrl}/cookbooks`, cookbook).pipe(
      map((savedCookbook: CookbookApi) => convertCookbookApiToCookbook(savedCookbook))
    );
  }

  editCookbook(cookbook: Cookbook): Observable<Cookbook> {
    return this.httpClient.put<RecipeApi>(`${environment.apiUrl}/cookbooks/${cookbook.id}`, cookbook).pipe(
      map((editedCookbook: CookbookApi) => convertCookbookApiToCookbook(editedCookbook))
    );
  }

  deleteCookbook(cookbookId: string): Observable<boolean> {
    return this.httpClient.delete<{ DELETED: boolean }>(`${environment.apiUrl}/cookbooks/${cookbookId}`)
      .pipe(map((result: { DELETED: boolean }) => result.DELETED));
  }

}
