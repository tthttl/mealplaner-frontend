import { Pipe, PipeTransform } from '@angular/core';
import { Language, I18n } from '../../shared/model/model';


@Pipe({name: 'translate'})
export class TranslatePipe implements PipeTransform {
  transform(key: string, i18n: I18n | null, language: Language = 'de'): string {
    return (i18n && i18n[language] && i18n[language][key]) ?? key;
  }
}
