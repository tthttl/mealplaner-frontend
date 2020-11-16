import { ShoppingList, ShoppingListItem } from '../../../../core/models/model';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export const shoppingListAdapter = createEntityAdapter<ShoppingList>({
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

export const shoppingListItemAdapter = createEntityAdapter<ShoppingListItem>({
  sortComparer: ((a, b) => (b.order || Number.MAX_VALUE) - (a.order || Number.MAX_VALUE)),
});

export interface ShoppingListState {
  readonly shoppingLists: {
    items: EntityState<ShoppingList>
  };
  readonly shoppingListItems: { [key: string]: EntityState<ShoppingListItem> };
  readonly activeShoppingList: string | undefined;
}

export const initialShoppingListState: ShoppingListState = {
  shoppingLists: {
    items: shoppingListAdapter.getInitialState(),
  },
  shoppingListItems: {},
  activeShoppingList: undefined,
};
