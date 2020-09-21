import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() buttonText = '';
  @Input() buttonType = 'button';
  @Input() isDisabled = false;
  @Input() testName = '';
  @Input() color = 'primary';
  @Input() iconLeft: string | undefined;
  @Input() iconRight: string | undefined;
  @Input() isInputGroup = false;
  @Input() hasErrors = false;
  @Output() clicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent): void {
    this.clicked.emit(event);
  }

}
