import { AbstractControl } from '@angular/forms';
import { EMAIL_PATTERN } from '../helpers/constants';


export function email(control: AbstractControl): { email: true } | null {
  if (!control.value.match(EMAIL_PATTERN)) {
    return { email: true };
  }
  return null;
}
