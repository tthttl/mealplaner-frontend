import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Cookbook } from '../../../core/models/model';

@Injectable()
export class CookbookService {
  constructor(private httpClient: HttpClient) {
  }

  loadCookbooks(userId: string): Observable<Cookbook[]> {
    return this.httpClient.get<Cookbook[]>(`${environment.apiUrl}/cookbooks?user=${userId}&_sort=title:asc`);
  }

  saveCookbook(title: string): Observable<Cookbook> {
    return this.httpClient.post<Cookbook>(`${environment.apiUrl}/cookbooks`, {title});
  }

  editCookbook(cookbook: Cookbook): Observable<Cookbook> {
    return this.httpClient.put<Cookbook>(`${environment.apiUrl}/cookbooks/${cookbook.id}`, cookbook);
  }

  deleteCookbook(cookbookId: string): Observable<boolean> {
    return this.httpClient.delete<{ DELETED: boolean }>(`${environment.apiUrl}/cookbooks/${cookbookId}`)
      .pipe(map((result: { DELETED: boolean }) => result.DELETED));
  }

}
