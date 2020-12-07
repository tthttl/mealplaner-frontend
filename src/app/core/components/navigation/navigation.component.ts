import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SUPPORTED_LANGUAGES } from '../../constants/constants';
import { I18n, Language, Link, SelectOption } from '../../models/model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  @Input() translations: I18n | null = null;
  @Input() currentLanguage: Language | null = null;
  @Input() isLoggedIn: boolean | null = null;
  @Output() logout: EventEmitter<null> = new EventEmitter();
  @Output() languageChanged: EventEmitter<Language> = new EventEmitter();

  links: Link[] = [
    {key: 'app.navigation.shopping-list', path: '/shopping-list', icon: 'shopping-cart'},
    {key: 'app.navigation.planer', path: '/meal-planer', icon: 'calendar-alt'},
    {key: 'app.navigation.menus', path: '/cookbook', icon: 'hamburger'},
  ];

  supportedLanguages: SelectOption<Language>[] = SUPPORTED_LANGUAGES.values.map((language: Language) => {
    return {value: language, key: language.toLocaleUpperCase()};
  });

  constructor() {
  }

  onLogout(): void {
    this.logout.emit();
  }

  changeLanguage(language: Language | null): void {
    if (language) {
      this.languageChanged.emit(language);
    }
  }
}
