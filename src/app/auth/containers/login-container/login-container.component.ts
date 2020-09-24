import { Component, OnInit } from '@angular/core';
import { I18n, Language, LoginCredentials } from '../../../shared/model/model';
import { select, Store } from '@ngrx/store';
import { GlobalState, selectTranslations } from '../../../shared/state';
import { LoginPageActions } from '../../actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-container',
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.scss']
})
export class LoginContainerComponent implements OnInit {

  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLanguage$: Observable<Language> = this.store.pipe(select(state => state.appState.language));

  constructor(private store: Store<GlobalState>) {
  }

  ngOnInit(): void {
  }

  login(credentials: LoginCredentials): void {
    this.store.dispatch(LoginPageActions.login({credentials}));
  }
}
