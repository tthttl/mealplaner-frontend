import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { DEFAULT_LANGUAGE } from '../../../shared/helpers/constants';
import { I18n, Language, LoginCredentials } from '../../../shared/model/model';
import * as CustomValidators from '../../../shared/validators/custom-validators.validator';
import { translateValidationErrors } from '../../../shared/helpers/helpers';

@Component({
  selector: 'app-login-form-page',
  templateUrl: './login-form-page.component.html',
  styleUrls: ['./login-form-page.component.scss']
})
export class LoginFormPageComponent {

  @Input() buttonText = 'login';
  @Input() translations: I18n | null = {};
  @Input() currentLang: Language | null = DEFAULT_LANGUAGE;
  @Input() backendErrorMessage: string | undefined;
  @Output() credentialsReceived: EventEmitter<LoginCredentials> = new EventEmitter();

  loginForm: FormGroup;

  constructor(private translatePipe: TranslatePipe) {
    this.loginForm = new FormGroup({
      identifier: new FormControl('', [
        Validators.required,
        CustomValidators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
      ])
    });
  }

  getFormControl(key: string): FormControl {
    return this.loginForm?.controls[key] as FormControl;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.credentialsReceived.emit(this.loginForm?.value);
      return;
    }

    this.loginForm.markAllAsTouched();
  }

  getErrorsFor(key: string): string[] {
    return translateValidationErrors(
      this.getFormControl(key),
      this.translatePipe,
      this.translations,
      this.currentLang)
      .filter((error, index) => index === 0);
  }
}
