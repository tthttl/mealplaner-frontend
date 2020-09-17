import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {

  @Input() formControl: FormControl | undefined;
  @Input() type = 'text';
  @Input() label: string | undefined;
  @Input() errors: string[] = [];
  @Input() isDisabled = false;
  @Input() autocomplete = 'on';
  @Input() placeholder = '';
  @Input() testName = '';

  @Output() inputChanged: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() fieldLeft: EventEmitter<void> = new EventEmitter<void>();

  inputId: string = uuid();

  onUserInput(event: Event): void {
    this.inputChanged.emit(event);
  }

  onBlur(): void {
    this.fieldLeft.emit();
  }


}
