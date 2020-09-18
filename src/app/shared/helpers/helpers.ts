import { ValidationErrors } from '@angular/forms';
import { TranslatePipe } from '../../i18n/pipes/translate.pipe';
import { I18n, I18n as I18nClient, Language } from '../../shared/model/model';
import { I18n as I18nApi } from '../../shared/model/model-api';

export function mapI18nApiToI18nClient(i18nApi: I18nApi): I18nClient {
  return {
    [i18nApi.lang]: i18nApi.translations
  };
}

export function translateValidationErrors(errors: ValidationErrors,
                                          translatePipe: TranslatePipe,
                                          translations: I18n,
                                          language: Language,
                                          key: string): string[] {
  return Object.keys(errors).map(error => translatePipe
    .transform('errors.validation.' + key + '.' + error, translations, language));
}
