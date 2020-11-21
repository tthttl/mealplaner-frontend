import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { I18n, Language } from '../../../../core/models/model';
import { GlobalState, selectTranslations } from '../../../../core/store';
import { select, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { ForgotPasswordContainerActions } from '../../store/actions';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password-container',
  templateUrl: './forgot-password-container.component.html',
  styleUrls: ['./forgot-password-container.component.scss']
})
export class ForgotPasswordContainerComponent {

  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLanguage$: Observable<Language> = this.store.pipe(select(state => state.appState.language));
  passwordResetRequested = false;
  emailQueryParam: string | undefined;


  constructor(private store: Store<GlobalState>, private actions$: Actions, private activatedRout: ActivatedRoute) {
    this.emailQueryParam = this.activatedRout.snapshot.queryParams?.email;
  }

  requestPasswordResetEmail(email: string): void {
    this.store.dispatch(ForgotPasswordContainerActions.requestEmail({email}));
    this.passwordResetRequested = true;
  }

}
