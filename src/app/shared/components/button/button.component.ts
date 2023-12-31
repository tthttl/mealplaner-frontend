import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IconName } from '@fortawesome/fontawesome-common-types';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {

  @Input() buttonText = '';
  @Input() buttonType = 'button';
  @Input() isDisabled = false;
  @Input() e2eTestName = '';
  @Input() color = 'primary';
  @Input() iconLeft: IconName | undefined;
  @Input() iconRight: IconName | undefined;
  @Input() isInputGroup = false;
  @Input() hasErrors = false;
  @Output() clicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent): void {
    this.clicked.emit(event);
  }
}
