import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SelectOption } from '../../model/model';
import { v4 as uuid } from 'uuid';


@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent<T extends object> implements OnInit {
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
  }

  onChange(option: T): void {
    this.valueChanged.emit(option);
  }

  getOptionKey(option: SelectOption<T>): string {
    return option?.key ?? (option.value && option.value.toString());
  }
}

