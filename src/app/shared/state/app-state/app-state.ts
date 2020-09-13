import { Language, I18n } from '../../model/model';

export interface AppState {
  readonly language: Language;
  readonly i18n: I18n | null;
}

export const initialAppState: AppState = {
  language: 'de',
  i18n: null
};
