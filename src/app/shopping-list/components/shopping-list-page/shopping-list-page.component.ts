import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DEFAULT_LANGUAGE } from '../../../shared/helpers/constants';
import {
  ArrayItemMovedEvent,
  BasicShoppingListItem,
  DeleteShoppingListItemEvent,
  I18n,
  Language,
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
  @Input() shoppingListItems: ShoppingListItem[] = [];
  @Input() activeShoppingListId: string | undefined | null = undefined;
  @Input() translations: I18n | null = {};
  @Input() currentLanguage: Language | null = DEFAULT_LANGUAGE;

  @Output() changeShoppingList: EventEmitter<string> = new EventEmitter();
  @Output() addShoppingListItem: EventEmitter<BasicShoppingListItem> = new EventEmitter();
  @Output() deleteShoppingListItem: EventEmitter<DeleteShoppingListItemEvent> = new EventEmitter();
  @Output() moveShoppingListItem: EventEmitter<ShoppingListItemMovedEvent> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onShoppingListChange(id: string): void {
    this.changeShoppingList.emit(id);
  }

  onItemAdded(shoppingListItem: BasicShoppingListItem): void {
    if (this.activeShoppingListId) {
      this.addShoppingListItem.emit({...shoppingListItem, shoppingList: this.activeShoppingListId});
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
