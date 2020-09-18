import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { DEFAULT_LANGAUGE } from '../../../shared/helpers/constants';
import { translateValidationErrors } from '../../../shared/helpers/helpers';
import { I18n, Language } from '../../../shared/model/model';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  @Input() isRegistration = false;
  @Input() translations: I18n = {};
  @Input() currentLang: Language = DEFAULT_LANGAUGE;
  @Output() credentialsReceived: EventEmitter<{ email: string, password: string }> =
    new EventEmitter<{ email: string; password: string }>();

  loginForm: FormGroup | undefined;

  constructor(private translatePipe: TranslatePipe) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,}/g)
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
    const formControl = this.getFormControl(key);
    if (formControl.invalid && formControl.errors &&
      (formControl.touched || formControl.dirty)) {
      return translateValidationErrors(
        formControl.errors,
        this.translatePipe,
        this.translations,
        this.currentLang,
        key);
    }
    return [];
  }

}
