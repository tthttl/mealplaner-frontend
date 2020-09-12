import { I18n as I18nApi } from '../model/model-api';
import { TranslatePipe } from '../../i18n/pipes/translate.pipe';
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
  });
});
