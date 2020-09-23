import { Language, I18n, User } from '../../model/model';

export interface AppState {
  readonly language: Language;
  readonly i18n: I18n | null;
  readonly user: User | null;
}

export const initialAppState: AppState = {
  language: 'de',
  i18n: null,
  user: null
};
