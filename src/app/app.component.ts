import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { I18n, Language } from './core/models/model';
import { GlobalState, isLoggedIn, isOffline, selectCurrentLanguage, selectTranslations } from './core/store';
import { NavigationActions } from './core/store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLanguage$: Observable<Language | null> = this.store.select(selectCurrentLanguage);
  isLoggedIn$: Observable<boolean | null> = this.store.select(isLoggedIn);
  isOffline$: Observable<boolean> = this.store.select(isOffline);

  get showBetaTeaser(): boolean {
    return environment.showBetaTeaser;
  }

  constructor(private store: Store<GlobalState>) {}

  onLogout(): void {
    this.store.dispatch(NavigationActions.logout());
  }

  changeLanguage(language: Language): void {
    this.store.dispatch(NavigationActions.changeLanguage({language}));
  }
}
