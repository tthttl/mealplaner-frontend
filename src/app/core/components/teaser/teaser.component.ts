import { Component, Input } from '@angular/core';
import { I18n, Language } from '../../models/model';

@Component({
  selector: 'app-teaser',
  templateUrl: './teaser.component.html',
  styleUrls: ['./teaser.component.scss']
})
export class TeaserComponent {
  @Input() text = '';
}
