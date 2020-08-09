import { Translations, TranslationsPerLanguage } from '../../shared/model/model';
import { I18nApiActions } from '../actions';
import { i18nReducer } from './i18n-api.reducers';

describe('i18nReducer', () => {
  const deTranslations: TranslationsPerLanguage = {
    lang: 'de',
    translations: {} as Translations
  };
  const enTranslations: TranslationsPerLanguage = {
    lang: 'en',
    translations: {} as Translations
  };
  it('should add translations to state', () => {
    expect(i18nReducer(undefined,
      I18nApiActions.getI18nSuccess({
        allTranslations: [deTranslations, enTranslations]
      }))).toEqual({
      i18n: {
        allTranslations: [deTranslations, enTranslations]
      }
    });
  });
});
