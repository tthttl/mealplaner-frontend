import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BasicShoppingListItem,
  CreateListDialogEvent,
  DeleteShoppingListItemEvent, EditListDialogEvent,
  I18n,
  Language,
  ShoppingList,
  ShoppingListItem,
  ShoppingListItemMovedEvent
} from '../../../shared/model/model';
import {
  activeShoppingList,
  activeShoppingListId,
  GlobalState,
  selectCurrentLanguage,
  selectCurrentShoppingListItems,
  selectShoppingLists,
  selectTranslations
} from '../../../shared/state';
import { ShoppingListContainerActions } from '../../actions';
import { Store } from '@ngrx/store';
import { v4 as uuid } from 'uuid';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { take } from 'rxjs/operators';
import { DialogService } from '../../../shared/services/dialog.service';
import { EditListDialogComponent } from '../../../shared/components/edit-list-dialog/edit-list-dialog.component';

@Component({
  selector: 'app-shopping-list-container',
  templateUrl: './shopping-list-container.component.html',
  styleUrls: ['./shopping-list-container.component.scss']
})
export class ShoppingListContainerComponent implements OnInit {

  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLanguage$: Observable<Language> = this.store.select(selectCurrentLanguage);
  shoppingListsItems$: Observable<ShoppingListItem[]> = this.store.select(selectCurrentShoppingListItems);
  shoppingLists$: Observable<ShoppingList[] | null> = this.store.select(selectShoppingLists);
  activeShoppingList$: Observable<ShoppingList | undefined> = this.store.select(activeShoppingList);
  activeShoppingListId$: Observable<string | undefined> = this.store.select(activeShoppingListId);

  constructor(private store: Store<GlobalState>, private snackBarService: SnackbarService, private dialogService: DialogService) {
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
    this.store.dispatch(ShoppingListContainerActions.toggleShoppingListItem(
      {shoppingListItemId: shoppingListItem.id, shoppingList: shoppingListItem.shoppingList}));

    this.snackBarService.openSnackBar('message.undo', 'message.action', 3000)
      .afterDismissed()
      .pipe(take(1))
      .subscribe(({dismissedByAction}) => {
        if (dismissedByAction) {
          this.store.dispatch(ShoppingListContainerActions.unToggleShoppingListItem(
            {shoppingListItemId: shoppingListItem.id, shoppingList: shoppingListItem.shoppingList}));
        } else {
          this.store.dispatch(ShoppingListContainerActions.deleteShoppingListItem({shoppingListItem}));
        }
      });
  }

  onShoppingListItemMoved({shoppingListId, previousIndex, currentIndex}: ShoppingListItemMovedEvent): void {
    this.store.dispatch(ShoppingListContainerActions.moveShoppingListItem({shoppingListId, previousIndex, currentIndex}));
  }

  onCreateShoppingList(): void {
    const dialogRef = this.dialogService.openDialog(EditListDialogComponent, {
      data: {},
      translations: {
        title: 'Neue Liste erstellen',
        'save-button-text': 'Hinzufügen',
        'cancel-button-text': 'Abbrechen'
      }
    });
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: CreateListDialogEvent | undefined) => {
        if (result?.event === 'create') {
          this.store.dispatch(ShoppingListContainerActions.createShoppingList({title: result.title}));
        }
      });
  }

  OnEditShoppingList(shoppingList: ShoppingList): void {
    const dialogRef = this.dialogService.openDialog(EditListDialogComponent, {
      data: shoppingList,
      translations: {
        title: 'Liste Bearbeiten',
        'save-button-text': 'Speichern',
        'cancel-button-text': 'Abbrechen'
      }
    });
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: EditListDialogEvent | undefined) => {
        if (result?.event === 'edit') {
          console.log(result.shoppingList);
          this.store.dispatch(ShoppingListContainerActions.editShoppingList({shoppingList: result.shoppingList}));
        }
      });
  }
}
