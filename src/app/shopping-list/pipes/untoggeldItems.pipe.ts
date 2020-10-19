import { Pipe, PipeTransform } from '@angular/core';
import { ShoppingListItem } from '../../shared/model/model';

@Pipe({name: 'unToggled'})
export class UnToggledPipe implements PipeTransform {
  transform(value: ShoppingListItem[]): ShoppingListItem[] {
    console.log(value);
    return value.filter(shoppingListItem => !shoppingListItem.isChecked);
  }
}
