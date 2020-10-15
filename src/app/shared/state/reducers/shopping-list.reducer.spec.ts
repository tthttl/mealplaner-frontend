import { ShoppingList, ShoppingListItem } from '../../model/model';
import { shoppingListReducers } from './shopping-list.reducers';
import { initialShoppingListState } from '../states/shopping-list-state';
import { ShoppingListApiActions, ShoppingListContainerActions, ShoppingListEffectActions } from '../../../shopping-list/actions';

describe('shoppingListReducers', () => {
  describe('I18nApiActions.getI18nSuccess', () => {
    it('should add shopping lists to the state', () => {
      const shoppingLists: ShoppingList[] = [{id: '1', title: 'test-1'}, {id: '2', title: 'test-2'}];

      expect(shoppingListReducers({...initialShoppingListState}, ShoppingListApiActions.loadShoppingListsSuccess({
        shoppingLists,
      }))).toEqual({
        ...initialShoppingListState,
        shoppingLists: {
          items: [...shoppingLists]
        },
      });
    });
  });

  describe('ShoppingListEffectActions.setActiveShoppingList', () => {
    it('should set active List', () => {
      expect(shoppingListReducers({...initialShoppingListState}, ShoppingListEffectActions.setActiveShoppingList({
        shoppingListId: '1234',
      }))).toEqual({
        ...initialShoppingListState,
        activeShoppingList: '1234',
      });
    });
  });

  describe('ShoppingListContainerActions.changeShoppingList', () => {
    it('should set active List', () => {
      expect(shoppingListReducers({...initialShoppingListState}, ShoppingListContainerActions.changeShoppingList({
        shoppingListId: '1234',
      }))).toEqual({
        ...initialShoppingListState,
        activeShoppingList: '1234',
      });
    });
  });

  describe('ShoppingListApiActions.loadShoppingListItemsSuccess', () => {
    it('should add shopping list item for one list', () => {
      const shoppingListItems: ShoppingListItem[] = [
        {title: 'Apple', shoppingList: '32', amount: 1, unit: 'kg', id: '42', order: 2, isChecked: false},
        {title: 'Banana', shoppingList: '32', amount: 1, unit: 'kg', id: '1', order: 1, isChecked: false},
      ];

      expect(shoppingListReducers({...initialShoppingListState}, ShoppingListApiActions.loadShoppingListItemsSuccess({
        shoppingListId: '1234', shoppingListItems: [...shoppingListItems]
      }))).toEqual({
        ...initialShoppingListState,
        shoppingListItems: {
          1234: [...shoppingListItems]
        }
      });
    });
  });

  describe('ShoppingListContainerActions.addShoppingListItem', () => {
    it('should optimistically add item to shopping list', () => {
      const shoppingListItems: ShoppingListItem[] = [
        {title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', id: '42', order: 2, isChecked: false},
        {title: 'Banana', shoppingList: '1234', amount: 1, unit: 'kg', id: '1', order: 1, isChecked: false},
      ];

      const shoppingListItem: ShoppingListItem = {
        title: 'Cherries', shoppingList: '1234', amount: 1, unit: 'kg', id: '1', isChecked: false
      };

      expect(
        shoppingListReducers({
            ...initialShoppingListState,
            shoppingListItems: {
              1234: [...shoppingListItems]
            }
          },
          ShoppingListContainerActions.addShoppingListItem({shoppingListItem})
        )).toEqual({
        ...initialShoppingListState,
        shoppingListItems: {
          1234: [shoppingListItem, ...shoppingListItems]
        }
      });
    });
  });

  describe('ShoppingListContainerActions.deleteShoppingListItem', () => {
    it('should optimistically remove item from shopping list', () => {
      const shoppingListItems: ShoppingListItem[] = [
        {title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', id: '42', order: 2, isChecked: false},
        {title: 'Banana', shoppingList: '1234', amount: 1, unit: 'kg', id: '1', order: 1, isChecked: false},
      ];

      expect(
        shoppingListReducers({
            ...initialShoppingListState,
            shoppingListItems: {
              1234: [...shoppingListItems]
            }
          },
          ShoppingListContainerActions.deleteShoppingListItem({shoppingListItem: shoppingListItems[0]})
        )).toEqual({
        ...initialShoppingListState,
        shoppingListItems: {
          1234: [shoppingListItems[1]]
        }
      });
    });
  });

  describe('ShoppingListContainerActions.moveShoppingListItem', () => {
    it('should optimistically update order of shopping list', () => {
      const shoppingListItems: ShoppingListItem[] = [
        {title: 'Cherries', shoppingList: '42', amount: 1, unit: 'kg', id: '1', order: 3, isChecked: false},
        {title: 'Apple', shoppingList: '42', amount: 1, unit: 'kg', id: '42', order: 2, isChecked: false},
        {title: 'Banana', shoppingList: '42', amount: 1, unit: 'kg', id: '1', order: 1, isChecked: false},
      ];

      expect(
        shoppingListReducers({
            ...initialShoppingListState,
            shoppingListItems: {
              1234: [...shoppingListItems]
            }
          },
          ShoppingListContainerActions.moveShoppingListItem({shoppingListId: '1234', currentIndex: 1, previousIndex: 0})
        )).toEqual({
        ...initialShoppingListState,
        shoppingListItems: {
          1234: [
            {title: 'Apple', shoppingList: '42', amount: 1, unit: 'kg', id: '42', order: 2, isChecked: false},
            {title: 'Cherries', shoppingList: '42', amount: 1, unit: 'kg', id: '1', order: 3, isChecked: false},
            {title: 'Banana', shoppingList: '42', amount: 1, unit: 'kg', id: '1', order: 1, isChecked: false},
          ]
        }
      });
    });
  });
});
