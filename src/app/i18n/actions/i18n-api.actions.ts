import { createAction, props } from '@ngrx/store';
import { TranslationsPerLanguage } from '../../shared/model/model';

export const getI18n = createAction('[Initialize App] Get i18n');
export const getI18nSuccess = createAction(
  '[Initialize App] Get i18n Success',
  props<{ allTranslations: TranslationsPerLanguage[] }>());
export const getI18nFailure = createAction('[Initialize App] Get i18n Failure');
