import { availableLanguages, TranslationsPerLanguage } from '../model/model';

export function selectMatchingTranslations(allTranslations: TranslationsPerLanguage[] | null,
                                           language: availableLanguages = 'de'): TranslationsPerLanguage | undefined {
  if (allTranslations) {
    return allTranslations
      .find((translationsPerLanguage) => translationsPerLanguage.lang === language);
  }
  return undefined;
}

export function getTranslationForKey(translationsForCurrentLanguage: TranslationsPerLanguage | undefined, key: string): string {
  if (translationsForCurrentLanguage && translationsForCurrentLanguage.translations) {
    return translationsForCurrentLanguage.translations.hasOwnProperty(key) ? translationsForCurrentLanguage.translations[key] : key;
  }
  return key;
}
