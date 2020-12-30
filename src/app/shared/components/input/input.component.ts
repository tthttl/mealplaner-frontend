import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]})
export class InputComponent implements ControlValueAccessor {

  @Input() type = 'text';
  @Input() name: string | undefined;
  @Input() border: boolean | 'all' | 'bottom' = true;
  @Input() ariaDescribedBy: string | undefined;
  @Input() minValue: number | undefined;
  @Input() label: string | undefined;
  @Input() errors: string[] = [];
  @Input() isDisabled = false;
  @Input() autocomplete: 'on' | 'off' = 'on';
  @Input() placeholder = '';
  @Input() e2eTestName = '';
  @Output() clicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  inputId: string = uuid();

  currentValue: string | number = '';

  onChange(option: string | number): void {
    this.propagateChange(option);
  }

  onBlur(): void {
    this.markAsTouched();
  }

  onClicked(event: MouseEvent): void {
    this.clicked.emit(event);
  }

  propagateChange = (value: string | number) => {};
  markAsTouched = () => {};

  registerOnChange(fn: () => {}): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.markAsTouched = fn;
  }

  writeValue(value: string | number): void {
    if (value !== undefined) {
      this.currentValue = value;
    }
  }


}
