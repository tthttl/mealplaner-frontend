import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { mapI18nApiToI18nClient } from '../helpers/helpers';
import { I18n as I18nClient, Language } from '../models/model';
import { I18n as I18nApi } from '../models/model-api';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  constructor(private httpClient: HttpClient) {
  }

  getI18n(lang: Language): Observable<I18nClient> {
    return this.httpClient.get<I18nApi>(`${environment.apiUrl}/i18n/${lang}`).pipe(
      map((i18n: I18nApi) => mapI18nApiToI18nClient(i18n))
    );
  }
}
