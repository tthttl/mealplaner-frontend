export type I18n = {
  readonly [key: string]: Translations;
};

export interface Translations {
  readonly [key: string]: string;
}

export type availableLanguages = 'de' | 'en';
