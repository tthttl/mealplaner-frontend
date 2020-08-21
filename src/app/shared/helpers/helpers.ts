import { I18n as I18nClient } from '../../shared/model/model';
import { I18n as I18nApi } from '../../shared/model/model-api';

export function mapI18nApiToI18nClient(i18nApi: I18nApi | null): I18nClient | null {
  if (i18nApi) {
    return {
      [i18nApi.lang]: i18nApi.translations
    };
  }
  return null;
}
