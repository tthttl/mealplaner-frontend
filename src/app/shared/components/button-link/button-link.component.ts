import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconName } from '@fortawesome/fontawesome-common-types';

@Component({
  selector: 'app-button-link',
  templateUrl: './button-link.component.html',
  styleUrls: ['./button-link.component.scss']
})
export class ButtonLinkComponent implements OnInit {
  @Input() linkText = '';
  @Input() e2eTestName = '';
  @Input() link = '';
  @Input() isDisabled = false;
  @Input() color = 'primary';
  @Input() iconLeft: IconName | undefined;
  @Input() iconRight: IconName | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
