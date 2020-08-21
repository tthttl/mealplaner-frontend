export type I18n = {
  readonly lang: string;
  readonly translations: Translations;
};

export interface Translations {
  readonly [key: string]: string;
}
