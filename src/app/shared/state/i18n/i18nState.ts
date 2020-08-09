import { I18n } from '../../model/model';

export interface I18nState {
  readonly i18n: I18n;
}

export const initialI18nState: I18nState = {
  i18n: {
    allTranslations: []
  }
};
