import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DEFAULT_LANGUAGE } from '../../../../core/constants/constants';
import { ArrayItemMovedEvent, I18n, Language, ShoppingListItem } from '../../../../core/models/model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingListComponent {
  @Input() items: ShoppingListItem[] | null | undefined = undefined;
  @Input() translations: I18n | null = {};
  @Input() currentLang: Language | null = DEFAULT_LANGUAGE;
  @Output() shoppingListItemDeleted: EventEmitter<ShoppingListItem> = new EventEmitter();
  @Output() shoppingListItemMoved: EventEmitter<ArrayItemMovedEvent> = new EventEmitter();

  deleteBuffer: { [key: string]: number } = {};
  deletionDelayInMilliseconds = 300;

  itemChecked(item: ShoppingListItem, isChecked: boolean): void {
    if (isChecked) {
      // Delay Deletion to make the checkmark visible
      this.deleteBuffer[item.id] = window.setTimeout(() => this.shoppingListItemDeleted.emit(item), this.deletionDelayInMilliseconds);
    } else {
      clearTimeout(this.deleteBuffer[item.id]);
    }
  }

  moveItem({previousIndex, currentIndex}: ArrayItemMovedEvent): void {
    if (currentIndex !== previousIndex) {
      this.shoppingListItemMoved.emit({currentIndex, previousIndex});
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
