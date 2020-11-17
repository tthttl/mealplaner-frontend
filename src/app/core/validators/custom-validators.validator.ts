import { AbstractControl } from '@angular/forms';
import { EMAIL_PATTERN } from '../constants/constants';


export function email(control: AbstractControl): { email: true } | null {
  return control.value.match(EMAIL_PATTERN) ? null :  { email: true };
}
