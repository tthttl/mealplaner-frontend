import { Language, I18n, User, ShoppingListItem } from '../../model/model';
import { DEFAULT_LANGUAGE } from '../../helpers/constants';

export interface ShoppingListState {
  readonly items: ShoppingListItem[];
}

export const initialShoppingListState: ShoppingListState = {
  items: []
};
