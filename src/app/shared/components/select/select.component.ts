import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOption } from '../../model/model';
import { v4 as uuid } from 'uuid';



@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]})
export class SelectComponent<T> implements OnInit, ControlValueAccessor {
  @Input() control: FormControl | undefined;
  @Input() name = '';
  @Input() options: SelectOption<T>[] = [];
  @Input() label: string | undefined;
  @Input() errors: string[] = [];
  @Input() isDisabled = false;
  @Input() e2eTestName = '';
  @Output() valueChanged: EventEmitter<T | string> = new EventEmitter();

  selectedValue: T | string | null = null;
  inputId: string = uuid();

  constructor() { }

  ngOnInit(): void {
    this.selectedValue = this.options[0].value;
    this.propagateChange(this.options[0].value);
  }

  onChange(option: T | string): void {
    this.propagateChange(option);
  }

  getOptionKey(option: SelectOption<T>): string {
    return option?.key ?? ((typeof option.value === 'string') ? option.value : JSON.stringify(option.value));
  }

  propagateChange = (value: T | string) => {};

  registerOnChange(fn: () => {}): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
  }

  writeValue(value: T | string): void {
    if (value !== undefined) {
      this.selectedValue = value;
    }
  }
}

