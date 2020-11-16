import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DEFAULT_LANGUAGE } from '../../../../core/constants/constants';
import {
  ArrayItemMovedEvent,
  BasicShoppingListItem,
  DeleteShoppingListItemEvent,
  I18n,
  Language,
  ShoppingList,
  ShoppingListItem,
  ShoppingListItemMovedEvent
} from '../../../../core/models/model';

@Component({
  selector: 'app-shopping-list-page',
  templateUrl: './shopping-list-page.component.html',
  styleUrls: ['./shopping-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingListPageComponent implements OnInit {
  @Input() shoppingLists: ShoppingList[] | null = null;
  @Input() shoppingListItems: ShoppingListItem[] | undefined | null = null;
  @Input() activeShoppingList: ShoppingList | undefined | null = undefined;
  @Input() activeShoppingListId: string | undefined | null = undefined;
  @Input() translations: I18n | null = {};
  @Input() currentLanguage: Language | null = DEFAULT_LANGUAGE;

  @Output() changeShoppingList: EventEmitter<ShoppingList> = new EventEmitter();
  @Output() addShoppingListItem: EventEmitter<BasicShoppingListItem> = new EventEmitter();
  @Output() deleteShoppingListItem: EventEmitter<DeleteShoppingListItemEvent> = new EventEmitter();
  @Output() moveShoppingListItem: EventEmitter<ShoppingListItemMovedEvent> = new EventEmitter();
  @Output() deleteShoppingList: EventEmitter<ShoppingList> = new EventEmitter();
  @Output() editShoppingList: EventEmitter<ShoppingList> = new EventEmitter();
  @Output() createShoppingList: EventEmitter<ShoppingList> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onShoppingListChange(shoppingList: ShoppingList): void {
    this.changeShoppingList.emit(shoppingList);
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

  onSelectList(shoppingList: ShoppingList): void {
    this.changeShoppingList.emit(shoppingList);
  }

  onEditList(shoppingList: ShoppingList): void {
    this.editShoppingList.emit(shoppingList);
  }

  onDeleteList(shoppingList: ShoppingList): void {
    this.deleteShoppingList.emit(shoppingList);
  }

  onCreateList(): void {
    this.createShoppingList.emit();
  }
}
