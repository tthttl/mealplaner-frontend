import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BasicShoppingListItem,
  DeleteShoppingListItemEvent,
  I18n,
  Language,
  ShoppingList,
  ShoppingListItem,
  ShoppingListItemMovedEvent
} from '../../../shared/model/model';
import {
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
  activeShoppingListId$: Observable<string | undefined> = this.store.select(activeShoppingListId);

  constructor(private store: Store<GlobalState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(ShoppingListContainerActions.loadShoppingLists());
  }

  onShoppingListChange(shoppingListId: string): void {
    this.store.dispatch(ShoppingListContainerActions.changeShoppingList({shoppingListId}));
  }

  onShoppingListItemAdded(shoppingListItem: BasicShoppingListItem): void {
    this.store.dispatch(ShoppingListContainerActions.addShoppingListItem({optimisticId: uuid(), shoppingListItem}));
  }

  onShoppingListItemDeleted({shoppingListId, shoppingListItem}: DeleteShoppingListItemEvent): void {
    this.store.dispatch(ShoppingListContainerActions.deleteShoppingListItem({shoppingListItem}));
  }

  onShoppingListItemMoved({shoppingListId, previousIndex, currentIndex}: ShoppingListItemMovedEvent): void {
    this.store.dispatch(ShoppingListContainerActions.moveShoppingListItem({shoppingListId, previousIndex, currentIndex}));
  }
}
