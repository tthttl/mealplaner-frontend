import { ShoppingList, ShoppingListItem } from '../../model/model';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export const shoppingListAdapter = createEntityAdapter<ShoppingList>({
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

export interface ShoppingListState {
  readonly shoppingLists: {
    items: EntityState<ShoppingList>
  };
  readonly shoppingListItems: { [key: string]: ShoppingListItem[] };
  readonly activeShoppingList: string | undefined;
}

export const initialShoppingListState: ShoppingListState = {
  shoppingLists: {
    items: shoppingListAdapter.getInitialState(),
  },
  shoppingListItems: {},
  activeShoppingList: undefined,
};
