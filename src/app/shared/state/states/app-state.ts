import { Language, I18n, User } from '../../model/model';
import { DEFAULT_LANGUAGE } from '../../helpers/constants';

export interface AppState {
  readonly language: Language;
  readonly i18n: I18n | null;
  readonly user: User | null;
  readonly requestedUrlBeforeLoginWasRequired: string | null;
}

export const initialAppState: AppState = {
  language: DEFAULT_LANGUAGE,
  i18n: null,
  user: null,
  requestedUrlBeforeLoginWasRequired: null
};
