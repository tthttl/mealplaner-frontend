import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { DEFAULT_LANGUAGE } from '../../../shared/helpers/constants';
import { translateValidationErrors } from '../../../shared/helpers/helpers';
import { I18n, Language, LoginCredentials } from '../../../shared/model/model';
import * as CustomValidators from '../../../shared/validators/custom-validators.validator';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent {

  @Input() heading = '';
  @Input() buttonText = '';
  @Input() backedErrorMessage: string | undefined;
  @Input() authForm: FormGroup  = new FormGroup({});
  @Output() formSubmit: EventEmitter<LoginCredentials> = new EventEmitter();

  /* tslint:disable no-any*/
  @ContentChild('formTemplate') formTemplate: TemplateRef<any> | null;
  @ContentChild('formFooter') formFooter: TemplateRef<any> | null;
  /* tslint:enable no-any*/

  constructor() {
    this.formTemplate = null;
    this.formFooter = null;
  }

  onSubmit(): void {
    this.formSubmit.emit(this.authForm?.value);
  }
}
