import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { GlobalState, selectTranslations } from '../../../shared/state';
import { Actions, ofType } from '@ngrx/effects';
import { ActivatedRoute } from '@angular/router';
import { AuthApiActions, ForgotPasswordContainerActions, ResetPasswordContainerActions } from '../../actions';
import { Observable } from 'rxjs';
import { I18n, Language } from '../../../shared/model/model';

@Component({
  selector: 'app-reset-password-container',
  templateUrl: './reset-password-container.component.html',
  styleUrls: ['./reset-password-container.component.scss']
})
export class ResetPasswordContainerComponent {

  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLanguage$: Observable<Language> = this.store.pipe(select(state => state.appState.language));
  backendError: string | undefined = undefined;
  codeQueryParam: string;

  constructor(private store: Store<GlobalState>, private actions$: Actions, private activatedRout: ActivatedRoute) {
    this.actions$.pipe(ofType(AuthApiActions.restPasswordFailure)).subscribe(({error}: {error: string}) => {
      this.backendError = error;
      console.log(error);
    });

    this.codeQueryParam = '' + this.activatedRout.snapshot.queryParams?.code;
  }

  resetPassword(password: string): void {
    this.store.dispatch(ResetPasswordContainerActions.resetPassword({password, resetPasswordToken: this.codeQueryParam}));
  }

}
