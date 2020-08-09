import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getI18n } from '../i18n/actions/i18n-api.actions';
import { GlobalState, selectTranslations } from '../shared/state';

@Component({
  selector: 'app-beta-teaser',
  templateUrl: './beta-teaser.component.html',
  styleUrls: ['./beta-teaser.component.scss']
})
export class BetaTeaserComponent implements OnInit {
  url = 'https://mealplaner.app';
  translations$ = this.store.select(selectTranslations);

  constructor(
    private location: Location,
    private store: Store<GlobalState>) {
  }

  ngOnInit(): void {
    this.url = `https://mealplaner.app${this.location.path()}`;
    this.store.dispatch(getI18n());
  }

  onClick(): void {
  }
}
