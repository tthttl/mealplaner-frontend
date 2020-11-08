import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { I18n, Language, LoginCredentials, RegisterCredentials } from '../../../shared/model/model';
import { GlobalState, selectTranslations } from '../../../shared/state';
import { select, Store } from '@ngrx/store';
import { AuthApiActions, LoginPageActions, RegisterContainerActions } from '../../actions';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-register-container',
  templateUrl: './register-container.component.html',
  styleUrls: ['./register-container.component.scss']
})
export class RegisterContainerComponent implements OnInit {

  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLanguage$: Observable<Language> = this.store.pipe(select(state => state.appState.language));
  backendError: string | undefined;

  constructor(private store: Store<GlobalState>,  private actions$: Actions) {
    this.actions$.pipe(ofType(AuthApiActions.registerFailure)).subscribe(({error}: {error: string}) => {
      this.backendError = error;
    });
  }

  ngOnInit(): void {
  }

  register(credentials: RegisterCredentials): void {
    this.store.dispatch(RegisterContainerActions.register({credentials}));
  }

}
