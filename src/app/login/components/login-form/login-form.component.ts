import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { DEFAULT_LANGAUGE, EMAIL_PATTERN } from '../../../shared/helpers/constants';
import { translateValidationErrors } from '../../../shared/helpers/helpers';
import { I18n, Language } from '../../../shared/model/model';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {

  @Input() buttonText = 'login';
  @Input() translations: I18n = {};
  @Input() currentLang: Language = DEFAULT_LANGAUGE;
  @Output() credentialsReceived: EventEmitter<{ email: string, password: string }> =
    new EventEmitter<{ email: string; password: string }>();

  loginForm: FormGroup;

  constructor(private translatePipe: TranslatePipe) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(EMAIL_PATTERN)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ])
    });
  }

  getFormControl(key: string): FormControl {
    return this.loginForm?.controls[key] as FormControl;
  }

  onSubmit(): void {
    this.credentialsReceived.emit(this.loginForm?.value);
  }

  getErrorsFor(key: string): string[] {
    return translateValidationErrors(
      this.getFormControl(key),
      this.translatePipe,
      this.translations,
      this.currentLang,
      key);
  }

}
