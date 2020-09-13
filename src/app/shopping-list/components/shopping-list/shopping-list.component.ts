import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArrayItemMovedEvent, AvailableLanguages, I18n, ShoppingListItem } from '../../../shared/model/model';
import { DEFAULT_LANGAUGE } from '../../../shared/helpers/constants';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent{
  @Input() items: ShoppingListItem[] = [];
  @Input() translations: I18n = {};
  @Input() currentLang: AvailableLanguages = DEFAULT_LANGAUGE;
  @Output() itemDeleted: EventEmitter<ShoppingListItem> = new EventEmitter();
  @Output() listItemMoved: EventEmitter<ArrayItemMovedEvent> = new EventEmitter();

  deleteBuffer: {[key: string]: number} = {};
  deletionDelayInMilliseconds = 1500;


  itemChecked(item: ShoppingListItem, isChecked: boolean): void {
    item.isChecked = isChecked;

    console.log('here');
    if (isChecked) {
      this.deleteBuffer[item.id] = window.setTimeout(() => this.itemDeleted.emit(item), this.deletionDelayInMilliseconds);
    } else {
      clearTimeout(this.deleteBuffer[item.id]);
    }
  }

  drop({previousIndex, currentIndex}: ArrayItemMovedEvent): void {
    this.listItemMoved.emit({currentIndex, previousIndex});
  }
}
