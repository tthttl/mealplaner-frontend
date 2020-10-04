import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { I18n, Language } from '../../../shared/model/model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Input() translations: I18n | null = null;
  @Input() currentLang: Language | null = null;
  @Input() isLoggedIn: boolean | null = null;
  @Output() logout: EventEmitter<null> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onLogout(): void {
    this.logout.emit();
  }

}
