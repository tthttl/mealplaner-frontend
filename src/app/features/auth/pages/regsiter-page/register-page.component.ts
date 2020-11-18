import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { DEFAULT_LANGUAGE } from '../../../../core/constants/constants';
import { I18n, Language, RegisterCredentials } from '../../../../core/models/model';
import * as CustomValidators from '../../../../core/validators/custom-validators.validator';
import { translateValidationErrors } from '../../../../core/helpers/helpers';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {

  @Input() buttonText = '';
  @Input() translations: I18n | null = {};
  @Input() backendErrorMessage: string | undefined;
  @Input() currentLang: Language | null = DEFAULT_LANGUAGE;
  @Output() credentialsReceived: EventEmitter<RegisterCredentials> = new EventEmitter();

  loginForm: FormGroup;

  constructor(private translatePipe: TranslatePipe) {
    this.loginForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
      ]),
      email: new FormControl('', [
        Validators.required,
        CustomValidators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),

      invitationCode: new FormControl('', [
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
