import { I18n as I18nApi } from '../model/model-api';
import { TranslatePipe } from '../pipes/translate.pipe';
import { mapI18nApiToI18nClient } from './helpers';

describe('Helpers', () => {
  describe('mapI18nApiToI18nClient', () => {
    const i18nApi: I18nApi = {
      lang: 'de',
      translations: {
        test: 'Test'
      }
    };
    it('should convert I18nApi', () => {
      expect(mapI18nApiToI18nClient(i18nApi)).toEqual({
        de: {
          test: 'Test'
        }
      });
    });
    it('should not fail when input is null', () => {
      expect(mapI18nApiToI18nClient(null)).toBe(null);
    });
  });
  describe('TranslatePipe', () => {
    const i18n = {
      de: {
        test: 'Uebersetzung',
        test2: 'Uebersetzung 2'
      },
      en: {
        test: 'Translation',
        test2: 'Translation 2'
      }
    };
    it('should return matching translation', () => {
      expect(new TranslatePipe().transform(i18n.en.test, i18n, 'en')).toEqual(i18n.en.test);
    });

    it('should return matching translation in german language when no language is supplied', () => {
      expect(new TranslatePipe().transform(i18n.de.test, i18n)).toEqual(i18n.de.test);
    });

    it('should return key when key not found', () => {
      expect(new TranslatePipe().transform('non-existing', i18n)).toEqual('non-existing');
    });

    it('should return key when i18n is null', () => {
      expect(new TranslatePipe().transform(i18n.de.test, null)).toEqual(i18n.de.test);
    });

  });
});
