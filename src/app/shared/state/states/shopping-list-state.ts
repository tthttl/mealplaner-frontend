import { ShoppingList, ShoppingListItem } from '../../model/model';

export interface ShoppingListState {
  readonly shoppingLists: {
    items: ShoppingList[];
  };
  readonly shoppingListItems: { [key: string]: ShoppingListItem[] };
  readonly activeShoppingList: string | undefined;
}

export const initialShoppingListState: ShoppingListState = {
  shoppingLists: {
    items: [],
  },
  shoppingListItems: {},
  activeShoppingList: undefined,
};
