import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true
    }
  ]
})
export class PasswordInputComponent implements ControlValueAccessor {

  @Input() name: string | undefined;
  @Input() border = true;
  @Input() ariaDescribedBy: string | undefined;
  @Input() minValue: number | undefined;
  @Input() label: string | undefined;
  @Input() errors: string[] = [];
  @Input() isDisabled = false;
  @Input() autocomplete: 'on' | 'off' = 'on';
  @Input() placeholder = '';
  @Input() e2eTestName = '';
  @Input() color = 'primary';
  @Output() clicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  @ViewChild('password', {static: true, read: ElementRef})
  passwordElementRef: ElementRef | undefined;

  isPasswordVisible = false;
  currentValue: string | number = '';

  onClicked(event: MouseEvent): void {
    this.clicked.emit(event);
  }

  onTouched = () => {
  }

  onChange = (value: string | number) => {
  }

  onInputChange(value: string | number): void {
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  // tslint:disable-next-line:no-any
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // tslint:disable-next-line:no-any
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // tslint:disable-next-line:no-any
  writeValue(value: any): void {
    if (value !== undefined) {
      this.currentValue = value;
    }
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  getIcon(): IconProp {
    return this.isPasswordVisible ? ['fas', 'eye-slash'] : ['fas', 'eye'];
  }
}
