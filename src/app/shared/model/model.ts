export interface I18n {
  allTranslations: TranslationsPerLanguage[];
}

export interface TranslationsPerLanguage {
  readonly lang: string;
  readonly translations: Translations;
}

export interface Translations {
  readonly [key: string]: string;
}

export type availableLanguages = 'de' | 'en';
