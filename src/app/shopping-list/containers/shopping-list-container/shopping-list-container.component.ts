import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AddShoppingListItemEvent,
  ArrayItemMovedEvent,
  DeleteShoppingListItemEvent,
  ShoppingList,
  ShoppingListItem, ShoppingListItemMovedEvent
} from '../../../shared/model/model';
import { activeShoppingListId, GlobalState, selectCurrentShoppingListItems, selectShoppingLists } from '../../../shared/state';
import { ShoppingListContainerActions } from '../../actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shopping-list-container',
  templateUrl: './shopping-list-container.component.html',
  styleUrls: ['./shopping-list-container.component.scss']
})
export class ShoppingListContainerComponent implements OnInit {

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

  onShoppingListItemAdded(shoppingListItem: ShoppingListItem): void {
    this.store.dispatch(ShoppingListContainerActions.addShoppingListItem({shoppingListItem}));
  }

  onShoppingListItemDeleted({shoppingListId, shoppingListItem}: DeleteShoppingListItemEvent): void {
    this.store.dispatch(ShoppingListContainerActions.deleteShoppingListItem({shoppingListItem}));
  }

  onShoppingListItemMoved({shoppingListId, previousIndex, currentIndex}: ShoppingListItemMovedEvent): void {
    this.store.dispatch(ShoppingListContainerActions.moveShoppingListItem({shoppingListId, previousIndex, currentIndex}));
  }
}
