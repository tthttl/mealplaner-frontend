import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { mapI18nApiToI18nClient } from '../../shared/helpers/helpers';
import { availableLanguages, I18n as I18nClient } from '../../shared/model/model';
import { I18n as I18nApi } from '../../shared/model/model-api';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  constructor(private httpClient: HttpClient) {
  }

  getI18n(lang: availableLanguages): Observable<I18nClient> {
    return this.httpClient.get<I18nApi>(`${environment.apiUrl}/i18n/${lang}`).pipe(
      map((i18n: I18nApi) => mapI18nApiToI18nClient(i18n))
    );
  }
}
