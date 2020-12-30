import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoginCredentials } from '../../../../core/models/model';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthFormComponent {

  @Input() heading = '';
  @Input() buttonText = '';
  @Input() backedErrorMessage: string | undefined;
  @Input() authForm: FormGroup = new FormGroup({});
  @Input() showButton = true;
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
