import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslationsPerLanguage } from '../../shared/model/model';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  url = 'http://localhost:1337/i18n';

  constructor(private httpClient: HttpClient) {
  }

  getI18n(): Observable<TranslationsPerLanguage[]> {
    return this.httpClient.get<TranslationsPerLanguage[]>(this.url);
  }
}
