import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { TextOnlySnackBar } from '@angular/material/snack-bar/simple-snack-bar';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '../../i18n/pipes/translate.pipe';
import { I18n, Language } from '../model/model';
import { GlobalState, selectTranslations } from '../state';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  private translations: I18n | null | undefined;
  private currentLang: Language | undefined;

  constructor(
    private snackBar: MatSnackBar,
    private store: Store<GlobalState>,
    private translatePipe: TranslatePipe
  ) {
    this.store.select(selectTranslations).subscribe((translations: I18n | null) => this.translations = translations);
    this.store.select((state: GlobalState) => state.appState.language).subscribe((lang: Language) => this.currentLang = lang);
  }

  openSnackBar(messageKey: string, actionKey: string, config?: MatSnackBarConfig): MatSnackBarRef<TextOnlySnackBar> {
    const message = this.translatePipe.transform(messageKey, this.translations || null, this.currentLang);
    const action = this.translatePipe.transform(actionKey, this.translations || null, this.currentLang);
    return this.snackBar.open(message, action, config || {
      duration: 10000
    });
  }
}
