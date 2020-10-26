import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DEFAULT_LANGUAGE } from '../../../shared/helpers/constants';
import { ArrayItemMovedEvent, I18n, Language, ShoppingListItem } from '../../../shared/model/model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent {
  @Input() items: ShoppingListItem[] | null | undefined = undefined;
  @Input() translations: I18n | null = {};
  @Input() currentLang: Language | null = DEFAULT_LANGUAGE;
  @Output() itemDeleted: EventEmitter<ShoppingListItem> = new EventEmitter();
  @Output() listItemMoved: EventEmitter<ArrayItemMovedEvent> = new EventEmitter();

  deleteBuffer: { [key: string]: number } = {};
  deletionDelayInMilliseconds = 300;

  itemChecked(item: ShoppingListItem, isChecked: boolean): void {
    if (isChecked) {
      this.deleteBuffer[item.id] = window.setTimeout(() => this.itemDeleted.emit(item), this.deletionDelayInMilliseconds);
    } else {
      clearTimeout(this.deleteBuffer[item.id]);
    }

  }

  drop({previousIndex, currentIndex}: ArrayItemMovedEvent): void {
    if (currentIndex !== previousIndex) {
      this.listItemMoved.emit({currentIndex, previousIndex});
    }
  }

  getPageState(items: ShoppingListItem[] | null | undefined): string {
    if (items === null || items === undefined) {
      return 'loading';
    }

    if (items.length === 0) {
      return 'empty';
    }

    return 'default';
  }
}
