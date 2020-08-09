import { Translations, TranslationsPerLanguage } from '../model/model';
import { getTranslationForKey, selectMatchingTranslations } from './helpers';

describe('Translate Pipe', () => {
  const deTranslations: TranslationsPerLanguage = {
    lang: 'de',
    translations: {} as Translations
  };
  const enTranslations: TranslationsPerLanguage = {
    lang: 'en',
    translations: {} as Translations
  };
  describe('selectMatchingTranslations', () => {
    it('should return undefined when translations is null', () => {
      expect(selectMatchingTranslations(null)).toBeUndefined();
    });
    it('should return undefined when no matching translations are found for language', () => {
      expect(selectMatchingTranslations([], 'en')).toBeUndefined();
    });
    it('should return - de - translations when no language is supplied', () => {
      expect(selectMatchingTranslations([deTranslations, enTranslations])).toEqual(deTranslations);
    });
    it('should return - en - translations when en language is supplied', () => {
      expect(selectMatchingTranslations([deTranslations, enTranslations], 'en'))
        .toEqual(enTranslations);
    });
  });
  describe('getTranslationForKey', () => {
    const key = 'KEY';
    it('should return key when translations is null', () => {
      expect(getTranslationForKey(undefined, key)).toEqual(key);
    });
    it('should return key when parameter has no translations', () => {
      expect(getTranslationForKey({} as TranslationsPerLanguage, key)).toEqual(key);
    });
    it('should return key when translations has no matching key', () => {
      expect(getTranslationForKey({lang: 'de', translations: {}}, key)).toEqual(key);
    });
    it('should return translation for key', () => {
      expect(getTranslationForKey({
        lang: 'de',
        translations: {
          [key]: 'dummy'
        }
      }, key)).toEqual('dummy');
    });
  });
});
