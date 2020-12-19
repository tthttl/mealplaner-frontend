import { Component } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { I18n, Language, RegisterCredentials } from '../../../../core/models/model';
import { GlobalState, selectTranslations } from '../../../../core/store';
import { AuthApiActions, RegisterContainerActions } from '../../store/actions';

@Component({
  selector: 'app-register-container',
  templateUrl: './register-container.component.html',
  styleUrls: ['./register-container.component.scss']
})
export class RegisterContainerComponent {
  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLanguage$: Observable<Language> = this.store.pipe(select(state => state.appState.language));
  backendError: string | undefined;
  isPasswordVisible = false;

  constructor(private store: Store<GlobalState>, private actions$: Actions) {
    this.actions$.pipe(ofType(AuthApiActions.registerFailure)).subscribe(({error}: { error: string }) => {
      this.backendError = error;
    });
  }

  register(credentials: RegisterCredentials): void {
    this.store.dispatch(RegisterContainerActions.register({credentials}));
  }

  onPasswordVisibilityChanged(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
