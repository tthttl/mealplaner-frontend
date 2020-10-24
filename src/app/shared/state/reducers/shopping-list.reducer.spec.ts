import { ShoppingList, ShoppingListItem } from '../../model/model';
import { shoppingListReducers } from './shopping-list.reducers';
import { initialShoppingListState } from '../states/shopping-list-state';
import { ShoppingListApiActions, ShoppingListContainerActions, ShoppingListEffectActions } from '../../../shopping-list/actions';

describe('shoppingListReducers', () => {
  describe('ShoppingListApiActions.loadShoppingListsSuccess', () => {
    it('should add shopping lists to the state', () => {
      const shoppingLists: ShoppingList[] = [{id: '1', title: 'test-1'}, {id: '2', title: 'test-2'}];

      expect(shoppingListReducers({...initialShoppingListState}, ShoppingListApiActions.loadShoppingListsSuccess({
        shoppingLists,
      }))).toEqual({
        ...initialShoppingListState,
        shoppingLists: {
          items: {ids: ['1', '2'], entities: {
            1: shoppingLists[0],
            2: shoppingLists[1],
          }}
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

  describe('ShoppingListContainerActions.addShoppingListItem$', () => {
    it('should optimistically add item to shopping list', () => {
      const shoppingListItems: ShoppingListItem[] = [
        {title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', id: '42', order: 2, isChecked: false},
        {title: 'Banana', shoppingList: '1234', amount: 1, unit: 'kg', id: '1', order: 1, isChecked: false},
      ];

      const shoppingListItem: ShoppingListItem = {
        title: 'Cherries', shoppingList: '1234', amount: 1, unit: 'kg', id: 'optimisticId', isChecked: false
      };

      expect(
        shoppingListReducers({
            ...initialShoppingListState,
            shoppingListItems: {
              1234: [...shoppingListItems]
            }
          },
          ShoppingListContainerActions.addShoppingListItem({optimisticId: 'optimisticId', shoppingListItem})
        )).toEqual({
        ...initialShoppingListState,
        shoppingListItems: {
          1234: [{...shoppingListItem}, ...shoppingListItems]
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

  describe('ShoppingListApiActions.addShoppingListItemSuccess,\n', () => {
    it('should update optimistic ID with with from Server', () => {
      const shoppingListItems: ShoppingListItem[] = [
        {id: 'optimistic', title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', order: 2, isChecked: false},
        {id: '1', title: 'Banana', shoppingList: '1234', amount: 1, unit: 'kg', order: 1, isChecked: false},
      ];

      expect(
        shoppingListReducers({
            ...initialShoppingListState,
            shoppingListItems: {
              1234: [...shoppingListItems]
            }
          },
          ShoppingListApiActions.addShoppingListItemSuccess({
            optimisticId: 'optimistic',
            shoppingListItem: {id: 'backendId', title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', order: 2, isChecked: false}
          })
        )).toEqual({
        ...initialShoppingListState,
        shoppingListItems: {
          1234: [
            {id: 'backendId', title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', order: 2, isChecked: false},
            shoppingListItems[1]
          ]
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

  describe('ShoppingListContainerActions.toggleShoppingListItem', () => {
    it('should optimistically update order of shopping list', () => {
      const shoppingListItems: ShoppingListItem[] = [
        {title: 'Cherries', shoppingList: '1234', amount: 1, unit: 'kg', id: '1', order: 3, isChecked: false},
        {title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', id: '42', order: 2, isChecked: false},
        {title: 'Banana', shoppingList: '1234', amount: 1, unit: 'kg', id: '12', order: 1, isChecked: false},
      ];

      expect(
        shoppingListReducers({
            ...initialShoppingListState,
            shoppingListItems: {
              1234: [...shoppingListItems]
            }
          },
          ShoppingListContainerActions.toggleShoppingListItem({shoppingList: '1234', shoppingListItemId: '42'})
        )).toEqual({
        ...initialShoppingListState,
        shoppingListItems: {
          1234: [
            {title: 'Cherries', shoppingList: '1234', amount: 1, unit: 'kg', id: '1', order: 3, isChecked: false},
            {title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', id: '42', order: 2, isChecked: true},
            {title: 'Banana', shoppingList: '1234', amount: 1, unit: 'kg', id: '12', order: 1, isChecked: false},
          ]
        }
      });
    });
  });

  describe('ShoppingListContainerActions.unToggleShoppingListItem', () => {
    it('should optimistically update order of shopping list', () => {
      const shoppingListItems: ShoppingListItem[] = [
        {title: 'Cherries', shoppingList: '1234', amount: 1, unit: 'kg', id: '1', order: 3, isChecked: false},
        {title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', id: '42', order: 2, isChecked: true},
        {title: 'Banana', shoppingList: '1234', amount: 1, unit: 'kg', id: '12', order: 1, isChecked: false},
      ];

      expect(
        shoppingListReducers({
            ...initialShoppingListState,
            shoppingListItems: {
              1234: [...shoppingListItems]
            }
          },
          ShoppingListContainerActions.unToggleShoppingListItem({shoppingList: '1234', shoppingListItemId: '42'})
        )).toEqual({
        ...initialShoppingListState,
        shoppingListItems: {
          1234: [
            {title: 'Cherries', shoppingList: '1234', amount: 1, unit: 'kg', id: '1', order: 3, isChecked: false},
            {title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', id: '42', order: 2, isChecked: false},
            {title: 'Banana', shoppingList: '1234', amount: 1, unit: 'kg', id: '12', order: 1, isChecked: false},
          ]
        }
      });
    });
  });

  describe('ShoppingListApiActions.createShoppingListSuccess', () => {
    it('should add and select new ShoppingList', () => {

      expect(
        shoppingListReducers({
            ...initialShoppingListState,
            activeShoppingList: '1234',
            shoppingLists: {
              items: {ids: ['1234'], entities: {
                  1234: {id: '1234', title: 'Test 1'},
                }}
            },
            shoppingListItems: {
              1234: []
            }
          },
          ShoppingListApiActions.createShoppingListSuccess({shoppingList: {id: '8888', title: 'Test Added'}})
        )).toEqual({
        ...initialShoppingListState,
        activeShoppingList: '8888',
        shoppingLists: {
          items: {ids: ['1234', '8888'], entities: {
              1234: {id: '1234', title: 'Test 1'},
              8888: {id: '8888', title: 'Test Added'},
            }}
        },
        shoppingListItems: {
          1234: [],
          8888: [],
        }
      });
    });
  });

  describe('ShoppingListContainerActions.editShoppingList', () => {
    it('should optimistically update ShoppingList', () => {

      expect(
        shoppingListReducers({
            ...initialShoppingListState,
            activeShoppingList: '1234',
            shoppingLists: {
              items: {ids: ['1234', '8888'], entities: {
                  1234: {id: '1234', title: 'Test 1'},
                  8888: {id: '8888', title: 'Test 1'},
                }}
            },
            shoppingListItems: {
              1234: []
            }
          },
          ShoppingListContainerActions.editShoppingList({shoppingList: {id: '8888', title: 'Updated'}})
        )).toEqual({
        ...initialShoppingListState,
        activeShoppingList: '1234',
        shoppingLists: {
          items: {ids: ['1234', '8888'], entities: {
              1234: {id: '1234', title: 'Test 1'},
              8888: {id: '8888', title: 'Updated'},
            }}
        },
        shoppingListItems: {
          1234: []
        }
      });
    });
  });
});
