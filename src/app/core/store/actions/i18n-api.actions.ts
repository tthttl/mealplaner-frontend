import { createAction, props } from '@ngrx/store';
import { I18n, Language } from '../../models/model';

export const getI18n = createAction('[Initialize App] Get i18n');
export const getI18nSuccess = createAction('[Initialize App] Get i18n Success', props<{ i18n: I18n, language: Language }>());
export const getI18nFailure = createAction('[Initialize App] Get i18n Failure');
