import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { I18n, Language } from '../../../../core/models/model';
import { GlobalState, selectTranslations } from '../../../../core/store';
import { AuthApiActions, ResetPasswordContainerActions } from '../../store/actions';

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
  isPasswordVisible = false;

  constructor(private store: Store<GlobalState>, private actions$: Actions, private activatedRout: ActivatedRoute) {
    this.actions$.pipe(ofType(AuthApiActions.restPasswordFailure)).subscribe(({error}: { error: string }) => {
      this.backendError = error;
    });

    this.codeQueryParam = '' + this.activatedRout.snapshot.queryParams?.code;
  }

  resetPassword(password: string): void {
    this.store.dispatch(ResetPasswordContainerActions.resetPassword({password, resetPasswordToken: this.codeQueryParam}));
  }

  onPasswordVisibilityChanged(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
