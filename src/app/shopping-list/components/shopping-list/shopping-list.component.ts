import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArrayItemMovedEvent, Language, I18n, ShoppingListItem } from '../../../shared/model/model';
import { DEFAULT_LANGUAGE } from '../../../shared/helpers/constants';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent{
  @Input() items: ShoppingListItem[] | null = [];
  @Input() translations: I18n = {};
  @Input() currentLang: Language = DEFAULT_LANGUAGE;
  @Output() itemDeleted: EventEmitter<ShoppingListItem> = new EventEmitter();
  @Output() listItemMoved: EventEmitter<ArrayItemMovedEvent> = new EventEmitter();


  itemChecked(item: ShoppingListItem, isChecked: boolean): void {
    this.itemDeleted.emit(item);
  }

  drop({previousIndex, currentIndex}: ArrayItemMovedEvent): void {
    if ( currentIndex !== previousIndex) {
      this.listItemMoved.emit({currentIndex, previousIndex});
    }
  }
}
