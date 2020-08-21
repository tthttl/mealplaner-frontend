import { Pipe, PipeTransform } from '@angular/core';
import { availableLanguages, I18n } from '../model/model';


@Pipe({name: 'translate'})
export class TranslatePipe implements PipeTransform {
  transform(key: string, i18n: I18n | null, language: availableLanguages = 'de'): string {
    return (i18n && i18n[language] && i18n[language][key]) || key;
  }
}
