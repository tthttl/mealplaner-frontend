import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { convertCookbookApisToCookbooks } from '../../shared/helpers/helpers';
import { Cookbook } from '../../shared/model/model';
import { CookbookApi } from '../../shared/model/model-api';

@Injectable()
export class CookbookService {
  constructor(private httpClient: HttpClient) {
  }

  loadCookbooks(userId: string): Observable<Cookbook[]> {
    return this.httpClient.get<CookbookApi[]>(`${environment.apiUrl}/cookbooks?user=${userId}`).pipe(
      map((cookbooks: CookbookApi[]) => convertCookbookApisToCookbooks(cookbooks))
    );
  }
}
