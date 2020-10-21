import { Pipe, PipeTransform } from '@angular/core';
import { ShoppingListItem } from '../../shared/model/model';

@Pipe({name: 'unToggled'})
export class UnToggledPipe implements PipeTransform {
  transform(value: ShoppingListItem[] | null): ShoppingListItem[] {
    if (!value) {
      return [];
    }
    return value.filter(shoppingListItem => !shoppingListItem.isChecked);
  }
}
