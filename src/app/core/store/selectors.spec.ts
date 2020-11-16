import { I18n, Translations } from '../models/model';
import { selectCurrentLanguage, selectTranslations } from './index';

describe('appStateSelectors', () => {
  const i18n: I18n = {
    de: {} as Translations
  };
  const appState = {
    language: 'de',
    i18n
  };
  it('should select i18n', () => {
    expect(selectTranslations.projector(appState)).toEqual(i18n);
  });
  it('should select currentLanguage', () => {
    expect(selectCurrentLanguage.projector(appState)).toEqual('de');
  });
});
