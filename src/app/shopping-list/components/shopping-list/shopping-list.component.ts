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
  @Input() translations: I18n | null = {};
  @Input() currentLang: Language | null = DEFAULT_LANGUAGE;
  @Output() itemDeleted: EventEmitter<ShoppingListItem> = new EventEmitter();
  @Output() listItemMoved: EventEmitter<ArrayItemMovedEvent> = new EventEmitter();

  deleteBuffer: {[key: string]: number} = {};
  deletionDelayInMilliseconds = 300;


  itemChecked(item: ShoppingListItem, isChecked: boolean): void {
    if (isChecked) {
      this.deleteBuffer[item.id] = window.setTimeout(() => this.itemDeleted.emit(item), this.deletionDelayInMilliseconds);
    } else {
      clearTimeout(this.deleteBuffer[item.id]);
    }

  }

  drop({previousIndex, currentIndex}: ArrayItemMovedEvent): void {
    if ( currentIndex !== previousIndex) {
      this.listItemMoved.emit({currentIndex, previousIndex});
    }
  }
}
