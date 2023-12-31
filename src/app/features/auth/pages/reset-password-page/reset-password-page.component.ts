import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DEFAULT_LANGUAGE } from '../../../../core/constants/constants';
import { translateValidationErrors } from '../../../../core/helpers/helpers';
import { I18n, Language } from '../../../../core/models/model';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
