import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { I18n, Language } from '../../../shared/model/model';
import { DEFAULT_LANGUAGE } from '../../../shared/helpers/constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import * as CustomValidators from '../../../shared/validators/custom-validators.validator';
import { translateValidationErrors } from '../../../shared/helpers/helpers';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss']
})
export class ForgotPasswordPageComponent implements OnInit {

  @Input() translations: I18n | null = {};
  @Input() currentLang: Language | null = DEFAULT_LANGUAGE;
  @Input() emailSent = false;
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
      this.currentLang)
      .filter((error, index) => index === 0);
  }

}
