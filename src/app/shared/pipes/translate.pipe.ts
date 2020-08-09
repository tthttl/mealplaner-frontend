import { Pipe, PipeTransform } from '@angular/core';
import { availableLanguages, TranslationsPerLanguage } from '../model/model';

@Pipe({name: 'translate'})
export class TranslatePipe implements PipeTransform {
  transform(allTranslations: TranslationsPerLanguage[] | null, key: string, language: availableLanguages = 'de'): string {
    const translationsForCurrentLanguage = allTranslations && allTranslations
      .find((translationsPerLanguage) => translationsPerLanguage.lang === language);
    return translationsForCurrentLanguage ? translationsForCurrentLanguage.translations[key] : key;
  }
}
