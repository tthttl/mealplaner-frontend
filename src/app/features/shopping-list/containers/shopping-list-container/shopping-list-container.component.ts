import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, withLatestFrom } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { EditListDialogComponent } from '../../../../shared/components/edit-list-dialog/edit-list-dialog.component';
import { DELETION_DELAY } from '../../../../core/constants/constants';
import {
  BasicShoppingListItem,
  CreateListDialogEvent,
  DeleteShoppingListItemEvent,
  EditListDialogEvent,
  I18n,
  Language,
  ShoppingList,
  ShoppingListItem,
  ShoppingListItemMovedEvent
} from '../../../../core/models/model';
import { DialogService } from '../../../../core/services/dialog.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import {
  activeShoppingList,
  activeShoppingListId,
  GlobalState,
  selectCurrentLanguage,
  selectCurrentShoppingListItems,
  selectShoppingLists,
  selectTranslations
} from '../../../../core/store';
import { ShoppingListContainerActions } from '../../store/actions';

@Component({
  selector: 'app-shopping-list-container',
  templateUrl: './shopping-list-container.component.html',
  styleUrls: ['./shopping-list-container.component.scss'],
})
export class ShoppingListContainerComponent implements OnInit {

  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLanguage$: Observable<Language> = this.store.select(selectCurrentLanguage);
  shoppingListsItems$: Observable<ShoppingListItem[] | undefined | null> = this.store.select(selectCurrentShoppingListItems);
  shoppingLists$: Observable<ShoppingList[] | null> = this.store.select(selectShoppingLists);
  activeShoppingList$: Observable<ShoppingList | undefined> = this.store.select(activeShoppingList);
  activeShoppingListId$: Observable<string | undefined> = this.store.select(activeShoppingListId);

  private createDialogTranslations: {} = {};
  private editDialogTranslations: {} = {};

  constructor(
    private store: Store<GlobalState>,
    private snackBarService: SnackbarService,
    private dialogService: DialogService,
    private translatePipe: TranslatePipe
  ) {
    this.store.select(selectTranslations).pipe(
      withLatestFrom(this.store.select((state: GlobalState) => state.appState.language))
    ).subscribe(([translations, currentLanguage]: [I18n | null, Language]) => {
      this.createDialogTranslations = {
        title: this.translatePipe.transform('create-list.title', translations, currentLanguage),
        'save-button-text': this.translatePipe.transform('create-list.save-button-text', translations, currentLanguage),
        'cancel-button-text': this.translatePipe.transform('create-list.cancel-button-text', translations, currentLanguage),
        placeholder: this.translatePipe.transform('create-list.placeholder', translations, currentLanguage),
      };

      this.editDialogTranslations = {
        title: this.translatePipe.transform('edit-list.title', translations, currentLanguage),
        'save-button-text': this.translatePipe.transform('edit-list.save-button-text', translations, currentLanguage),
        'cancel-button-text': this.translatePipe.transform('edit-list.cancel-button-text', translations, currentLanguage),
        placeholder: this.translatePipe.transform('edit-list.placeholder', translations, currentLanguage),

      };
    });
  }

  ngOnInit(): void {
    this.store.dispatch(ShoppingListContainerActions.loadShoppingLists());
  }

  onShoppingListChange(shoppingList: ShoppingList): void {
    this.store.dispatch(ShoppingListContainerActions.changeShoppingList({shoppingListId: shoppingList.id}));
  }

  onShoppingListItemAdded(shoppingListItem: BasicShoppingListItem): void {
    this.store.dispatch(ShoppingListContainerActions.addShoppingListItem({optimisticId: uuid(), shoppingListItem}));
  }

  onShoppingListItemDeleted({shoppingListItem}: DeleteShoppingListItemEvent): void {
    this.store.dispatch(ShoppingListContainerActions.deleteShoppingListItem({shoppingListItem}));

    this.snackBarService.openSnackBar('message.undo', 'message.action', 3000)
      .afterDismissed()
      .pipe(take(1))
      .subscribe(({dismissedByAction}) => {
        if (dismissedByAction) {
          this.store.dispatch(ShoppingListContainerActions.undoDeleteShoppingListItem({shoppingListItem}));
        }
      });
  }

  onShoppingListItemMoved({shoppingListId, previousIndex, currentIndex}: ShoppingListItemMovedEvent): void {
    this.store.dispatch(ShoppingListContainerActions.moveShoppingListItem({shoppingListId, previousIndex, currentIndex}));
  }

  onCreateShoppingList(): void {
    const dialogRef = this.dialogService.openDialog(EditListDialogComponent, {
      data: {},
      translations: this.createDialogTranslations,
    });
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: CreateListDialogEvent | undefined) => {
        if (result?.event === 'create') {
          this.store.dispatch(ShoppingListContainerActions.createShoppingList({title: result.title}));
        }
      });
  }

  onEditShoppingList(shoppingList: ShoppingList): void {
    const dialogRef = this.dialogService.openDialog(EditListDialogComponent, {
      data: shoppingList,
      translations: this.editDialogTranslations,
    });
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: EditListDialogEvent | undefined) => {
        if (result?.event === 'edit') {
          this.store.dispatch(ShoppingListContainerActions.editShoppingList({shoppingList: result.list}));
        }
      });
  }

  onShoppingListDelete(shoppingList: ShoppingList): void {
    this.store.dispatch(ShoppingListContainerActions.deleteShoppingList({shoppingList}));
    this.snackBarService.openSnackBar('message.undo', 'message.action', DELETION_DELAY)
      .afterDismissed()
      .pipe(take(1))
      .subscribe(({dismissedByAction}) => {
        if (dismissedByAction) {
          this.store.dispatch(ShoppingListContainerActions.undoDeleteShoppingList({shoppingList}));
        }
      });
  }
}