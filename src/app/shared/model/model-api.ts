export type I18n = {
  readonly lang: string;
  readonly translations: Translations;
};

export interface Translations {
  readonly [key: string]: string;
}

export interface UserApi {
  jwt: string;
  user: {
    username: string,
    email: string
  };
}
