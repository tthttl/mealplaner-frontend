import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() text = ''; // kell type is?
  @Input() isDisabled = false;
  @Input() testName = '';
  @Input() color: ThemePalette = 'primary';
  @Input() iconLeft: string | undefined;
  @Input() iconRight: string | undefined;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>(); // kell ez ide egyaltalan?

  onClick(): void {
    this.clicked.emit();
  }

}
