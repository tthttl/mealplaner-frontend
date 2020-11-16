import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../../constants/constants';
import { I18n, Language, SelectOption } from '../../models/model';

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
  @Output() languageChanged: EventEmitter<Language> = new EventEmitter();

  supportedLanguages: SelectOption<Language>[] = SUPPORTED_LANGUAGES.values.map((language: Language) => {
    return {value: language, key: language.toLocaleUpperCase()};
  });

  languageForm: FormGroup = new FormGroup({
    selectedLanguage: new FormControl(DEFAULT_LANGUAGE, [Validators.required])
  });

  constructor() {
  }

  ngOnInit(): void {
  }

  getSelectedLanguage(): FormControl {
    return this.languageForm?.controls.selectedLanguage as FormControl;
  }

  onLogout(): void {
    this.logout.emit();
  }

  changeLanguage(language: Language): void {
    this.languageChanged.emit(language);
  }
}
