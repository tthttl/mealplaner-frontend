import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { I18n, Language } from '../../../../core/models/model';
import { DEFAULT_LANGUAGE } from '../../../../core/constants/constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import * as CustomValidators from '../../../../core/validators/custom-validators.validator';
import { translateValidationErrors } from '../../../../core/helpers/helpers';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordPageComponent implements OnInit {

  @Input() translations: I18n | null = {};
  @Input() currentLanguage: Language | null = DEFAULT_LANGUAGE;
  @Input() passwordResetRequested = false;
  @Input() emailPrefillValue: string | undefined;
  @Output() submitResetRequestForm: EventEmitter<string> = new EventEmitter();

  requestPasswordResetCodeForm: FormGroup;

  constructor(private translatePipe: TranslatePipe) {
    this.requestPasswordResetCodeForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        CustomValidators.email,
      ])
    });
  }

  ngOnInit(): void {
    if (this.emailPrefillValue) {
      this.requestPasswordResetCodeForm.setValue({email: this.emailPrefillValue});
    }
  }

  getFormControl(key: string): FormControl {
    return this.requestPasswordResetCodeForm?.controls[key] as FormControl;
  }

  onSubmit(): void {
    if (this.requestPasswordResetCodeForm.valid) {
      this.submitResetRequestForm.emit(this.requestPasswordResetCodeForm?.value.email);
      return;
    }

    this.requestPasswordResetCodeForm.markAllAsTouched();
  }

  getErrorsFor(key: string): string[] {
    return translateValidationErrors(
      this.getFormControl(key),
      this.translatePipe,
      this.translations,
      this.currentLanguage)
      .filter((error, index) => index === 0);
  }
}
