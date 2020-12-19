import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { DEFAULT_LANGUAGE } from '../../../../core/constants/constants';
import { translateValidationErrors } from '../../../../core/helpers/helpers';
import { I18n, Language, LoginCredentials } from '../../../../core/models/model';
import * as CustomValidators from '../../../../core/validators/custom-validators.validator';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  @Input() translations: I18n | null = {};
  @Input() currentLanguage: Language | null = DEFAULT_LANGUAGE;
  @Input() backendErrorMessage: string | undefined;
  @Output() login: EventEmitter<LoginCredentials> = new EventEmitter();

  loginForm: FormGroup;
  isPasswordVisible = false;

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

  get email(): string {
    return this.loginForm.value.identifier;
  }

  getFormControl(key: string): FormControl {
    return this.loginForm?.controls[key] as FormControl;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.login.emit(this.loginForm?.value);
      return;
    }

    this.loginForm.markAllAsTouched();
  }

  getErrorsFor(key: string): string[] {
    return translateValidationErrors(
      this.getFormControl(key),
      this.translatePipe,
      this.translations,
      this.currentLanguage)
      .filter((error, index) => index === 0);
  }

    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    getIcon(): IconProp {
        return this.isPasswordVisible ? ['fas', 'eye-slash'] : ['fas', 'eye'];
    }

}
