import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { I18n, Language, User } from '../../../../core/models/model';
import { GlobalState, selectTranslations, selectUser } from '../../../../core/store';
import { select, Store } from '@ngrx/store';
import { DialogService } from '../../../../core/services/dialog.service';
import { DeleteAccountConfirmationDialogPageComponent } from '../../pages/delete-account-confirmation-dialog-page/delete-account-confirmation-dialog-page.component';
import { filter, take, withLatestFrom } from 'rxjs/operators';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { AccountContainerActions } from '../../store/actions';

@Component({
  selector: 'app-account-container',
  templateUrl: './account-container.component.html',
  styleUrls: ['./account-container.component.scss']
})
export class AccountContainerComponent implements OnInit {
  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLanguage$: Observable<Language> = this.store.pipe(select(state => state.appState.language));
  currentUser$: Observable<User | null> = this.store.select(selectUser);

  private currentUser: User | null = null;
  private confirmDialogTranslations: { [key: string]: string } = {};

  constructor(private store: Store<GlobalState>, private dialogService: DialogService, private translatePipe: TranslatePipe) {
    this.store.select(selectTranslations).pipe(
      withLatestFrom(this.store.select((state: GlobalState) => state.appState.language))
    ).subscribe(([translations, currentLanguage]: [I18n | null, Language]) => {
      this.confirmDialogTranslations = {
        'button-confirm': this.translatePipe.transform('account-delete-confirm.button-confirm', translations, currentLanguage),
        'button-discard': this.translatePipe.transform('account-delete-confirm.button-discard', translations, currentLanguage),
        'task-label': this.translatePipe.transform('account-delete-confirm.task-label', translations, currentLanguage),
        'no-undo': this.translatePipe.transform('account-delete-confirm.no-undo', translations, currentLanguage),
        title: this.translatePipe.transform('account-delete-confirm.title', translations, currentLanguage),
        warning: this.translatePipe.transform('account-delete-confirm.warning', translations, currentLanguage),
      };
    });

    this.currentUser$.subscribe((user) => this.currentUser = user);
  }

  ngOnInit(): void {
  }

  onDelete(): void {
    const dialogRef = this.dialogService.openDialog(DeleteAccountConfirmationDialogPageComponent, {
      translations: this.confirmDialogTranslations,
      data: this.currentUser
    });

    dialogRef.afterClosed()
      .pipe(
        take(1),
        filter(({confirmed}) => confirmed),
        withLatestFrom(this.store.select(selectUser))
      )
      .subscribe(([_, user]) => {
        if (this.currentUser) {
          this.store.dispatch(AccountContainerActions.deleteAccount({user: this.currentUser}));
        }
      });
  }
}
