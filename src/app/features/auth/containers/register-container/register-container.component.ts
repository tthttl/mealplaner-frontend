import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { I18n, Language, RegisterCredentials } from '../../../../core/models/model';
import { GlobalState, selectTranslations } from '../../../../core/store';
import { select, Store } from '@ngrx/store';
import { AuthApiActions, RegisterContainerActions } from '../../store/actions';
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

  constructor(private store: Store<GlobalState>, private actions$: Actions) {
    this.actions$.pipe(ofType(AuthApiActions.registerFailure)).subscribe(({error}: { error: string }) => {
      this.backendError = error;
    });
  }

  ngOnInit(): void {
  }

  register(credentials: RegisterCredentials): void {
    this.store.dispatch(RegisterContainerActions.register({credentials}));
  }

}
