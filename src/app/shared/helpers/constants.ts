import { Language, StringUnion } from '../model/model';

export const DEFAULT_LANGUAGE: Language = 'de';
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const DEFAUT_REDIRECT_URL_FOR_LOGGED_IN_USER = 'shopping-list';

export const SUPPORTED_LANGUAGES = StringUnion('de', 'en');
