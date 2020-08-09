import { Pipe, PipeTransform } from '@angular/core';
import { availableLanguages, TranslationsPerLanguage } from '../model/model';
import { getTranslationForKey, selectMatchingTranslations } from './helpers';

@Pipe({name: 'translate'})
export class TranslatePipe implements PipeTransform {
  transform(allTranslations: TranslationsPerLanguage[] | null, key: string, language: availableLanguages = 'de'): string {
    return getTranslationForKey(selectMatchingTranslations(allTranslations, language), key);
  }
}
