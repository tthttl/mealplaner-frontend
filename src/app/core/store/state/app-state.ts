import { DEFAULT_LANGUAGE } from '../../constants/constants';
import { I18n, Language, User } from '../../models/model';

export interface AppState {
  readonly language: Language;
  readonly i18n: I18n | null;
  readonly user: User | null;
  readonly requestedUrlBeforeLoginWasRequired: string | null;
  readonly isOffline: boolean;
}

export const initialAppState: AppState = {
  language: DEFAULT_LANGUAGE,
  i18n: null,
  user: null,
  requestedUrlBeforeLoginWasRequired: null,
  isOffline: false,
};
