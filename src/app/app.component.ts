import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { I18n, Language } from './shared/model/model';
import { GlobalState, isLoggedIn, selectCurrentLanguage, selectTranslations } from './shared/state';
import { NavActions } from './shared/state/app-actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLang$: Observable<Language | null> = this.store.select(selectCurrentLanguage);
  isLoggedIn: Observable<boolean | null> = this.store.select(isLoggedIn);

  constructor(private store: Store<GlobalState>) {
  }

  onLogout(): void {
    this.store.dispatch(NavActions.logout());
  }
}
