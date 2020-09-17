import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {

  @Input() buttonText = '';
  @Input() buttonType = 'button';
  @Input() buttonTestName = '';
  @Input() color: ThemePalette = 'primary';
  @Input() iconLeft: string | undefined;

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
  @Output() clicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  inputId: string = uuid();

  onUserInput(event: Event): void {
    this.inputChanged.emit(event);
  }

  onBlur(): void {
    this.fieldLeft.emit();
  }

  onClicked(event: MouseEvent): void {
    this.clicked.emit(event);
  }


}
