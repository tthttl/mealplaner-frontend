import { Pipe, PipeTransform } from '@angular/core';
import { Language, I18n } from '../../core/models/model';
import { DEFAULT_LANGUAGE } from '../../core/constants/constants';


@Pipe({name: 'translate'})
export class TranslatePipe implements PipeTransform {
  transform(key: string, i18n: I18n | null, language?: Language | null): string {
    return (i18n && i18n[language || DEFAULT_LANGUAGE] && i18n[language || DEFAULT_LANGUAGE][key]) ?? key;
  }
}
