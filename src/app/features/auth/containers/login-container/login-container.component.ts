import { Component, OnInit } from '@angular/core';
import { I18n, Language, LoginCredentials } from '../../../../core/models/model';
import { select, Store } from '@ngrx/store';
import { GlobalState, selectTranslations } from '../../../../core/store';
import { AuthApiActions, LoginPageActions } from '../../store/actions';
import { Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-login-container',
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.scss']
})
export class LoginContainerComponent implements OnInit {

  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLanguage$: Observable<Language> = this.store.pipe(select(state => state.appState.language));
  backendError: string | undefined;


  constructor(private store: Store<GlobalState>, private actions$: Actions) {
    this.actions$.pipe(ofType(AuthApiActions.loginFailure)).subscribe(({error}: {error: string}) => {
      this.backendError = error;
    });
  }

  ngOnInit(): void {
  }

  login(credentials: LoginCredentials): void {
    this.store.dispatch(LoginPageActions.login({credentials}));
  }
}
