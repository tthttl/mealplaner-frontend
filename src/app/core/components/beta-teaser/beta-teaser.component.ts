import { Component, Input } from '@angular/core';
import { I18n, Language } from '../../models/model';

@Component({
  selector: 'app-beta-teaser',
  templateUrl: './beta-teaser.component.html',
  styleUrls: ['./beta-teaser.component.scss']
})
export class BetaTeaserComponent {
  @Input() translations: I18n | null = null;
  @Input() currentLanguage: Language | null = null;
}
