import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { I18n, Language, User } from '../../../../core/models/model';
import { DEFAULT_LANGUAGE } from '../../../../core/constants/constants';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {
  @Input() translations: I18n | null = {};
  @Input() currentLanguage: Language | null = DEFAULT_LANGUAGE;
  @Input() user: User | null = null;
  @Output() delete: EventEmitter<undefined> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  deleteAccount(): void {
    this.delete.emit();
  }
}
