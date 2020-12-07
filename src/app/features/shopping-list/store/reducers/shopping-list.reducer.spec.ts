import { ShoppingList, ShoppingListItem } from '../../../../core/models/model';
import { shoppingListReducers } from './shopping-list.reducers';
import { initialShoppingListState } from '../state/shopping-list-state';
import { ShoppingListApiActions, ShoppingListContainerActions, ShoppingListEffectActions } from '../actions';

describe('shoppingListReducers', () => {
  describe('ShoppingListApiActions.loadShoppingListsSuccess', () => {
    it('should add shopping lists to the state', () => {
      const shoppingLists: ShoppingList[] = [{id: '1', title: 'test-1'}, {id: '2', title: 'test-2'}];

      expect(shoppingListReducers({...initialShoppingListState}, ShoppingListApiActions.loadShoppingListsSuccess({
        shoppingLists,
      }))).toEqual({
        ...initialShoppingListState,
        shoppingLists: {
          ids: ['1', '2'], entities: {
            1: shoppingLists[0],
            2: shoppingLists[1],
          }
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
        {id: '42', title: 'Apple', shoppingList: '32', amount: 1, unit: 'kg', order: 2},
        {id: '1', title: 'Banana', shoppingList: '32', amount: 1, unit: 'kg', order: 1},
      ];

      expect(shoppingListReducers({...initialShoppingListState}, ShoppingListApiActions.loadShoppingListItemsSuccess({
        shoppingListId: '1234', shoppingListItems: [...shoppingListItems]
      }))).toEqual({
        ...initialShoppingListState,
        shoppingListItems: {
          1234: {
            ids: ['42', '1'],
            entities: {
              42: {id: '42', title: 'Apple', shoppingList: '32', amount: 1, unit: 'kg', order: 2},
              1: {id: '1', title: 'Banana', shoppingList: '32', amount: 1, unit: 'kg', order: 1},
            }
          }
        }
      });
    });
  });

  describe('ShoppingListContainerActions.addShoppingListItem$', () => {
    it('should optimistically add item to shopping list', () => {
      const shoppingListItem: ShoppingListItem = {
        title: 'Cherries', shoppingList: '1234', amount: 1, unit: 'kg', id: 'optimisticId'
      };

      expect(
        shoppingListReducers({
            ...initialShoppingListState,
            shoppingListItems: {
              1234: {
                ids: ['42', '1'],
                entities: {
                  42: {title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', id: '42', order: 2},
                  1: {title: 'Banana', shoppingList: '1234', amount: 1, unit: 'kg', id: '1', order: 1},
                }
              }
            }
          },
          ShoppingListContainerActions.addShoppingListItem({optimisticId: 'optimisticId', shoppingListItem})
        )).toEqual({
        ...initialShoppingListState,
        shoppingListItems: {
          1234: {
            ids: ['optimisticId', '42', '1'],
            entities: {
              42: {title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', id: '42', order: 2},
              1: {title: 'Banana', shoppingList: '1234', amount: 1, unit: 'kg', id: '1', order: 1},
              optimisticId: {title: 'Cherries', shoppingList: '1234', amount: 1, unit: 'kg', id: 'optimisticId'},
            }
          }
        }
      });
    });
  });

  describe('ShoppingListContainerActions.deleteShoppingListItem', () => {
    it('should optimistically remove item from shopping list', () => {
      const shoppingListItems: ShoppingListItem[] = [
        {title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', id: '42', order: 2},
        {title: 'Banana', shoppingList: '1234', amount: 1, unit: 'kg', id: '1', order: 1},
      ];

      expect(
        shoppingListReducers({
            ...initialShoppingListState,
            shoppingListItems: {
              1234: {
                ids: ['42', '1'],
                entities: {
                  42: {title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', id: '42', order: 2},
                  1: {title: 'Banana', shoppingList: '1234', amount: 1, unit: 'kg', id: '1', order: 1},
                }
              }
            }
          },
          ShoppingListContainerActions.deleteShoppingListItem({shoppingListItem: shoppingListItems[0]})
        )).toEqual({
        ...initialShoppingListState,
        shoppingListItems: {
          1234: {
            ids: ['1'],
            entities: {
              1: {title: 'Banana', shoppingList: '1234', amount: 1, unit: 'kg', id: '1', order: 1},
            }
          }
        }
      });
    });
  });

  describe('ShoppingListApiActions.addShoppingListItemSuccess,\n', () => {
    it('should update optimistic ID with with from Server', () => {
      expect(
        shoppingListReducers({
            ...initialShoppingListState,
            shoppingListItems: {
              1234: {
                ids: ['42', '1'],
                entities: {
                  optimistic: {title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', id: 'optimistic', order: 2},
                  1: {title: 'Banana', shoppingList: '1234', amount: 1, unit: 'kg', id: '1', order: 1},
                }
              }
            }
          },
          ShoppingListApiActions.addShoppingListItemSuccess({
            optimisticId: 'optimistic',
            shoppingListItem: {id: 'backendId', title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', order: 2}
          })
        )).toEqual({
        ...initialShoppingListState,
        shoppingListItems: {
          1234: {
            ids: ['backendId', '1'],
            entities: {
              backendId: {title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', id: 'backendId', order: 2},
              1: {title: 'Banana', shoppingList: '1234', amount: 1, unit: 'kg', id: '1', order: 1},
            }
          }
        }
      });
    });
  });

  describe('ShoppingListContainerActions.bulkUpdateShoppingListItems', () => {
    it('should optimistically update order of shopping list', () => {
      expect(
        shoppingListReducers({
            ...initialShoppingListState,
            shoppingListItems: {
              1234: {
                ids: ['1', '42', '91'],
                entities: {
                  1: {title: 'Cherries', shoppingList: '42', amount: 1, unit: 'kg', id: '1', order: 3},
                  42: {title: 'Apple', shoppingList: '42', amount: 1, unit: 'kg', id: '42', order: 2},
                  91: {title: 'Banana', shoppingList: '42', amount: 1, unit: 'kg', id: '91', order: 1},
                }
              }
            }
          },
          ShoppingListEffectActions.bulkUpdateShoppingListItems({
            shoppingListId: '1234', shoppingListItems: [
              {title: 'Cherries', shoppingList: '42', amount: 1, unit: 'kg', id: '1', order: 2},
              {title: 'Apple', shoppingList: '42', amount: 1, unit: 'kg', id: '42', order: 3}
            ]
          })
        )).toEqual({
        ...initialShoppingListState,
        shoppingListItems: {
          1234: {
            ids: ['42', '1', '91'],
            entities: {
              1: {title: 'Cherries', shoppingList: '42', amount: 1, unit: 'kg', id: '1', order: 2},
              42: {title: 'Apple', shoppingList: '42', amount: 1, unit: 'kg', id: '42', order: 3},
              91: {title: 'Banana', shoppingList: '42', amount: 1, unit: 'kg', id: '91', order: 1},
            }
          }
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
              ids: ['1234'], entities: {
                1234: {id: '1234', title: 'Test 1'},
              }
            },
            shoppingListItems: {
              1234: {ids: [], entities: {}}
            }
          },
          ShoppingListApiActions.createShoppingListSuccess({shoppingList: {id: '8888', title: 'Test Added'}})
        )).toEqual({
        ...initialShoppingListState,
        activeShoppingList: '8888',
        shoppingLists: {
          ids: ['1234', '8888'], entities: {
            1234: {id: '1234', title: 'Test 1'},
            8888: {id: '8888', title: 'Test Added'},
          }
        },
        shoppingListItems: {
          1234: {ids: [], entities: {}},
          8888: {ids: [], entities: {}},
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
              ids: ['1234', '8888'], entities: {
                1234: {id: '1234', title: 'Test 1'},
                8888: {id: '8888', title: 'Test 1'},
              }
            },
            shoppingListItems: {
              1234: {ids: [], entities: {}},
            }
          },
          ShoppingListContainerActions.editShoppingList(
            {shoppingList: {id: '8888', title: 'Test 1'}, changes: {id: '8888', title: 'Updated'}}
            )
        )).toEqual({
        ...initialShoppingListState,
        activeShoppingList: '1234',
        shoppingLists: {
          ids: ['1234', '8888'], entities: {
            1234: {id: '1234', title: 'Test 1'},
            8888: {id: '8888', title: 'Updated'},
          }
        },
        shoppingListItems: {
          1234: {ids: [], entities: {}},
        }
      });
    });
  });

  describe(' ShoppingListContainerActions.deleteShoppingList', () => {
    it('should optimistically delete ShoppingList', () => {

      expect(
        shoppingListReducers({
            ...initialShoppingListState,
            activeShoppingList: '1234',
            shoppingLists: {
              ids: ['1234', '8888'], entities: {
                1234: {id: '1234', title: 'Test 1'},
                8888: {id: '8888', title: 'Delete'},
              }
            },
            shoppingListItems: {
              1234: {ids: [], entities: {}},
              8888: {ids: [], entities: {}},
            }
          },
          ShoppingListContainerActions.deleteShoppingList({shoppingList: {id: '8888', title: 'Delete'}})
        )).toEqual({
        ...initialShoppingListState,
        activeShoppingList: '1234',
        shoppingLists: {
          ids: ['1234'], entities: {
            1234: {id: '1234', title: 'Test 1'},
          }
        },
        shoppingListItems: {
          1234: {ids: [], entities: {}},
          8888: {ids: [], entities: {}},
        }
      });
    });
  });

  describe('ShoppingListContainerActions.undoDeleteShoppingListItem', () => {
    it('should revert optimistically delete ShoppingListItem', () => {
      expect(
        shoppingListReducers({
            ...initialShoppingListState,
            shoppingListItems: {
              1234: {
                ids: ['1'],
                entities: {
                  1: {title: 'Banana', shoppingList: '1234', amount: 1, unit: 'kg', id: '1', order: 1},
                }
              }
            }
          },
          ShoppingListContainerActions.undoDeleteShoppingListItem({
            shoppingListItem: {id: '2', title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', order: 2}
          })
        )).toEqual({
        ...initialShoppingListState,
        shoppingListItems: {
          1234: {
            ids: ['2', '1'],
            entities: {
              2: {title: 'Apple', shoppingList: '1234', amount: 1, unit: 'kg', id: '2', order: 2},
              1: {title: 'Banana', shoppingList: '1234', amount: 1, unit: 'kg', id: '1', order: 1},
            }
          }
        }
      });
    });
  });


  describe('  ShoppingListContainerActions.undoDeleteShoppingList', () => {
    it('should revert optimistically delete ShoppingList', () => {

      expect(
        shoppingListReducers({
            ...initialShoppingListState,
            activeShoppingList: '1234',
            shoppingLists: {
              ids: ['1234'], entities: {
                1234: {id: '1234', title: 'Test 1'},
              }
            },
            shoppingListItems: {
              1234: {ids: [], entities: {}},
              8888: {ids: [], entities: {}},
            }
          },
          ShoppingListContainerActions.undoDeleteShoppingList({shoppingList: {id: '8888', title: 'Delete'}})
        )).toEqual({
        ...initialShoppingListState,
        activeShoppingList: '1234',
        shoppingLists: {
          ids: ['8888', '1234'], entities: {
            1234: {id: '1234', title: 'Test 1'},
            8888: {id: '8888', title: 'Delete'},
          }
        },
        shoppingListItems: {
          1234: {ids: [], entities: {}},
          8888: {ids: [], entities: {}},
        }
      });
    });
  });

  describe('ShoppingListApiActions.deleteShoppingListSuccess', () => {
    it('should clear shoppingListItems after delete ShoppingList successfully', () => {

      expect(
        shoppingListReducers({
            ...initialShoppingListState,
            activeShoppingList: '1234',
            shoppingLists: {
              ids: ['1234'], entities: {
                1234: {id: '1234', title: 'Test 1'},
              }
            },
            shoppingListItems: {
              1234: {ids: [], entities: {}},
              8888: {ids: [], entities: {}},
            }
          },
          ShoppingListApiActions.deleteShoppingListSuccess({shoppingList: {id: '8888', title: 'Delete'}})
        )).toEqual({
        ...initialShoppingListState,
        activeShoppingList: '1234',
        shoppingLists: {
          ids: ['1234'], entities: {
            1234: {id: '1234', title: 'Test 1'},
          }
        },
        shoppingListItems: {
          1234: {ids: [], entities: {}},
        }
      });
    });
  });
});
