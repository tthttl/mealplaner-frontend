import { Component } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { I18n, Language, LoginCredentials } from '../../../../core/models/model';
import { GlobalState, selectTranslations } from '../../../../core/store';
import { AuthApiActions, LoginContainerActions } from '../../store/actions';

@Component({
  selector: 'app-login-container',
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.scss']
})
export class LoginContainerComponent {
  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLanguage$: Observable<Language> = this.store.pipe(select(state => state.appState.language));
  backendError: string | undefined;

  constructor(private store: Store<GlobalState>, private actions$: Actions) {
    this.actions$.pipe(ofType(AuthApiActions.loginFailure)).subscribe(({error}: { error: string }) => {
      this.backendError = error;
    });
  }

  onLogin(credentials: LoginCredentials): void {
    this.store.dispatch(LoginContainerActions.login({credentials}));
  }

}
