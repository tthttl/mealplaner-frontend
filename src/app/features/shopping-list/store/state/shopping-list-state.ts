import { ShoppingList, ShoppingListItem } from '../../../../core/models/model';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export const shoppingListAdapter = createEntityAdapter<ShoppingList>({
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

export const shoppingListItemAdapter = createEntityAdapter<ShoppingListItem>({
  sortComparer: ((a, b) => {
    if ( (a.order ?? Number.MAX_VALUE) < (b.order ?? Number.MAX_VALUE)) {
      return 1;
    }

    if ( (a.order ?? Number.MAX_VALUE) > (b.order ?? Number.MAX_VALUE)) {
      return -1;
    }

    return 0;
  }),
});

export interface ShoppingListState {
  readonly shoppingLists: EntityState<ShoppingList>;
  readonly shoppingListItems: { [key: string]: EntityState<ShoppingListItem> };
  readonly activeShoppingList: string | undefined;
}

export const initialShoppingListState: ShoppingListState = {
  shoppingLists: shoppingListAdapter.getInitialState(),
  shoppingListItems: {},
  activeShoppingList: undefined,
};
