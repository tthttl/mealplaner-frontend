import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  @Input() color = 'primary';
  @Input() iconLeft: string | undefined;

  @Input() control: FormControl | undefined;
  @Input() type = 'text';
  @Input() label: string | undefined;
  @Input() errors: string[] = [];
  @Input() isDisabled = false;
  @Input() autocomplete = 'on';
  @Input() placeholder = '';
  @Input() e2eTestName = '';
  @Output() clicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  inputId: string = uuid();

  onClicked(event: MouseEvent): void {
    this.clicked.emit(event);
  }


}
