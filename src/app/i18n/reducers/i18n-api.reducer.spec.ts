import { I18n, Translations } from '../../shared/model/model';
import { I18nApiActions } from '../actions';
import { appStateReducer } from './i18n-api.reducers';

describe('i18nReducer', () => {
  const i18n: I18n = {
    de: {} as Translations
  };
  it('should add translations to state', () => {
    expect(appStateReducer(undefined,
      I18nApiActions.getI18nSuccess({
        i18n
      }))).toEqual({
      language: 'de',
      i18n
    });
  });

  it('should add en translations as second to state', () => {
    expect(appStateReducer({
        language: 'de',
        i18n
      },
      I18nApiActions.getI18nSuccess({
        i18n: {
          en: {} as Translations
        }
      }))).toEqual({
      language: 'de',
      i18n: {
        de: {} as Translations,
        en: {} as Translations
      }
    });
  });
});
