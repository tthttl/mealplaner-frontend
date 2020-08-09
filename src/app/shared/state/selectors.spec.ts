import { Translations, TranslationsPerLanguage } from '../model/model';
import { selectTranslations } from './index';

describe('i18nSelectors', () => {
  const translationResult: TranslationsPerLanguage = {
    lang: 'de',
    translations: {} as Translations
  };
  it('should select all translations', () => {
    expect(selectTranslations.projector({
      i18n: {
        allTranslations: [translationResult]
      }
    }, [translationResult]))
      .toEqual([translationResult]);
  });
});
