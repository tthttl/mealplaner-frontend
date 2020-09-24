import { FormControl } from '@angular/forms';
import { TranslatePipe } from '../../i18n/pipes/translate.pipe';
import { ArrayItemMovedEvent, I18n, I18n as I18nClient, Language } from '../../shared/model/model';
import { I18n as I18nApi } from '../../shared/model/model-api';

export function mapI18nApiToI18nClient(i18nApi: I18nApi): I18nClient {
  return {
    [i18nApi.lang]: i18nApi.translations
  };
}

export function translateValidationErrors(formControl: FormControl,
                                          translatePipe: TranslatePipe,
                                          translations: I18n,
                                          language: Language,
                                          key: string): string[] {
  if (formControl.invalid && formControl.errors &&
    (formControl.touched || formControl.dirty)) {
    return Object.keys(formControl.errors).map(error => translatePipe
      .transform('errors.validation.' + key + '.' + error, translations, language));
  }
  return [];
}

export function changeElementPosition<T>(input: T[], {previousIndex, currentIndex}: ArrayItemMovedEvent): T[] {
  const tempList: T[] = [...input];
  const result: T[] = [];
  const elementDragged = input[previousIndex];
  tempList.splice(previousIndex, 1);

  if (currentIndex === tempList.length) {
    result.push(...[...tempList, elementDragged]);
  } else {
    tempList.forEach((item, index) => {
      if (index === currentIndex) {
        result.push(elementDragged);
      }
      result.push(item);
    });
  }

  return result;
}
