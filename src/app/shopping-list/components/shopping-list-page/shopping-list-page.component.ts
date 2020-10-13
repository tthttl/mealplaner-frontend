import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AddShoppingListItemEvent,
  ArrayItemMovedEvent,
  DeleteShoppingListItemEvent,
  ShoppingList,
  ShoppingListItem,
  ShoppingListItemMovedEvent
} from '../../../shared/model/model';

@Component({
  selector: 'app-shopping-list-page',
  templateUrl: './shopping-list-page.component.html',
  styleUrls: ['./shopping-list-page.component.scss']
})
export class ShoppingListPageComponent implements OnInit {
  @Input() shoppingLists: ShoppingList[] | null = [];
  @Input() shoppingListItems: ShoppingListItem[] | null = [];
  @Input() activeShoppingListId: string | undefined | null = undefined;

  @Output() changeShoppingList: EventEmitter<string> = new EventEmitter();
  @Output() addShoppingListItem: EventEmitter<AddShoppingListItemEvent> = new EventEmitter();
  @Output() deleteShoppingListItem: EventEmitter<DeleteShoppingListItemEvent> = new EventEmitter();
  @Output() moveShoppingListItem: EventEmitter<ShoppingListItemMovedEvent> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onShoppingListChange(id: string): void {
    this.changeShoppingList.emit(id);
  }

  onItemAdded(shoppingListItem: ShoppingListItem): void {
    if (this.activeShoppingListId) {
      this.addShoppingListItem.emit({shoppingListItem, shoppingListId: this.activeShoppingListId});
    }
  }

  onShoppingListItemDeleted(shoppingListItem: ShoppingListItem): void {
    if (this.activeShoppingListId) {
      this.deleteShoppingListItem.emit({shoppingListItem, shoppingListId: this.activeShoppingListId});
    }
  }

  onShoppingListItemMoved(arrayItemMovedEvent: ArrayItemMovedEvent): void {
    if (this.activeShoppingListId) {
      this.moveShoppingListItem.emit({shoppingListId: this.activeShoppingListId, ...arrayItemMovedEvent});
    }
  }
}
