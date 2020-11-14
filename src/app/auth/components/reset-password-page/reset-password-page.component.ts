import { Component, EventEmitter, Input, Output } from '@angular/core';
import { I18n, Language } from '../../../shared/model/model';
import { DEFAULT_LANGUAGE } from '../../../shared/helpers/constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { translateValidationErrors } from '../../../shared/helpers/helpers';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.scss']
})
export class ResetPasswordPageComponent {

  @Input() translations: I18n | null = {};
  @Input() currentLang: Language | null = DEFAULT_LANGUAGE;
  @Input() backendError: string | undefined;
  @Output() submitResetPasswordForm: EventEmitter<string> = new EventEmitter();

  resetPasswordResetCodeForm: FormGroup;

  constructor(private translatePipe: TranslatePipe) {
    this.resetPasswordResetCodeForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ])
    });
  }

  getFormControl(key: string): FormControl {
    return this.resetPasswordResetCodeForm?.controls[key] as FormControl;
  }

  onSubmit(): void {
    if (this.resetPasswordResetCodeForm.valid) {
      this.submitResetPasswordForm.emit(this.resetPasswordResetCodeForm?.value.password);
      return;
    }

    this.resetPasswordResetCodeForm.markAllAsTouched();
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
