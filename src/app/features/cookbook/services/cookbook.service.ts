import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { convertCookbookApisToCookbooks, convertCookbookApiToCookbook } from '../../../core/helpers/helpers';
import { Cookbook } from '../../../core/models/model';
import { CookbookApi } from '../../../core/models/model-api';

@Injectable()
export class CookbookService {
  constructor(private httpClient: HttpClient) {
  }

  loadCookbooks(userId: string): Observable<Cookbook[]> {
    return this.httpClient.get<CookbookApi[]>(`${environment.apiUrl}/cookbooks?user=${userId}&_sort=title:asc`).pipe(
      map((cookbooks: CookbookApi[]) => convertCookbookApisToCookbooks(cookbooks))
    );
  }

  saveCookbook(title: string): Observable<Cookbook> {
    return this.httpClient.post<CookbookApi>(`${environment.apiUrl}/cookbooks`, {title}).pipe(
      map((savedCookbook: CookbookApi) => convertCookbookApiToCookbook(savedCookbook))
    );
  }

  editCookbook(cookbook: Cookbook): Observable<Cookbook> {
    return this.httpClient.put<CookbookApi>(`${environment.apiUrl}/cookbooks/${cookbook.id}`, cookbook).pipe(
      map((editedCookbook: CookbookApi) => convertCookbookApiToCookbook(editedCookbook))
    );
  }

  deleteCookbook(cookbookId: string): Observable<boolean> {
    return this.httpClient.delete<{ DELETED: boolean }>(`${environment.apiUrl}/cookbooks/${cookbookId}`)
      .pipe(map((result: { DELETED: boolean }) => result.DELETED));
  }

}
