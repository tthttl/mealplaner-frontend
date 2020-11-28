import { Action, createReducer, on } from '@ngrx/store';
import { initialMealPlanerState, mealPlanerAdapter, MealPlanerState } from '../state/meal-planer-state';
import { MealPlanerApiActions, MealPlanerContainerActions, MealPlanerEffectActions } from '../actions';

export const mealPlanerStateReducers = createReducer<MealPlanerState, Action>(
  initialMealPlanerState,
  on(MealPlanerContainerActions.selectedDateChanged, (state: MealPlanerState, {selectedDate}: { selectedDate: Date }) => {
    return {
      ...state,
      selectedDate
    };
  }),
  on(
    MealPlanerApiActions.loadMealPlanersSuccess,
    (state: MealPlanerState, {mealPlaners}) => {
      return {
        ...state,
        mealPlaners: mealPlanerAdapter.addMany(mealPlaners, state.mealPlaners),
      };
    }),
  on(
    MealPlanerEffectActions.setActiveMealPlaner,
    MealPlanerContainerActions.changeSelectedMealPlaner,
    (state: MealPlanerState, {mealPlanerId}) => {
      return {
        ...state,
        activeMealPlaner: mealPlanerId || undefined,
      };
    }),
  on(
    MealPlanerApiActions.createMealPlanerSuccess,
    (state: MealPlanerState, {mealPlaner}) => {
      return {
        ...state,
        mealPlaners: mealPlanerAdapter.addOne(mealPlaner, state.mealPlaners),
        meals: {
          ...state.meals,
          [mealPlaner.id]: {},
        },
        activeMealPlaner: mealPlaner.id,
      };
    }
  ),
  on(
    MealPlanerContainerActions.editMealPlaner,
    (state: MealPlanerState, {changes}) => {
      return {
        ...state,
        mealPlaners: mealPlanerAdapter.updateOne({id: changes.id, changes}, state.mealPlaners),
      };
    }
  ),
  on(
    MealPlanerEffectActions.undoOptimisticEditMealPlaner,
    (state: MealPlanerState, {mealPlaner}) => {
      return {
        ...state,
        mealPlaners: mealPlanerAdapter.updateOne({id: mealPlaner.id, changes: mealPlaner}, state.mealPlaners),
      };
    }
  ),
  on(
    MealPlanerContainerActions.deleteMealPlaner,
    (state: MealPlanerState, {mealPlaner}) => {
      return {
        ...state,
        mealPlaners: mealPlanerAdapter.removeOne(mealPlaner.id, state.mealPlaners),
      };
    }
  ),
  on(
    MealPlanerContainerActions.undoDeleteMealPlaner,
    MealPlanerEffectActions.undoOptimisticDeleteMealPlaner,
    (state: MealPlanerState, {mealPlaner}) => {
      return {
        ...state,
        mealPlaners: mealPlanerAdapter.addOne(mealPlaner, state.mealPlaners),
      };
    }
  ),
  on(
    MealPlanerApiActions.deleteMealPlanerSuccess,
    (state: MealPlanerState, {mealPlaner}) => {
      const copyMeals = {...state.meals};

      if (copyMeals.hasOwnProperty(mealPlaner.id)) {
        delete copyMeals[mealPlaner.id];
      }

      return {
        ...state,
        meals: copyMeals,
      };
    }
  )
  /*
 on(
   ShoppingListApiActions.loadShoppingListsSuccess,
   (state: ShoppingListState, {shoppingLists}: LoadShoppingListsSuccessAction) => {
     return {
       ...state,
       shoppingLists: shoppingListAdapter.addMany(shoppingLists, state.shoppingLists),
     };
   }),
   on(
    ShoppingListApiActions.loadShoppingListItemsSuccess,
    (state: ShoppingListState, {shoppingListId, shoppingListItems}: LoadShoppingListItemsSuccessAction) => {
      return {
        ...state,
        shoppingLists: shoppingListAdapter.updateOne({id: shoppingListId, changes: {isInitialized: true}}, state.shoppingLists),
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingListId]: shoppingListItemAdapter.addMany(shoppingListItems, shoppingListItemAdapter.getInitialState()),
        }
      };
    }),
  on(
    ShoppingListContainerActions.addShoppingListItem,
    (state: ShoppingListState, {optimisticId, shoppingListItem}: AddShoppingListItemAction) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingListItem.shoppingList]: shoppingListItemAdapter.addOne(
            {id: optimisticId, ...shoppingListItem},
            state.shoppingListItems[shoppingListItem.shoppingList])
        }
      };
    }
  ),
  on(
    ShoppingListApiActions.addShoppingListItemSuccess,
    (state: ShoppingListState, action: AddShoppingListItemSuccessAction) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [action.shoppingListItem.shoppingList]: shoppingListItemAdapter.updateOne(
            {id: action.optimisticId, changes: action.shoppingListItem},
            state.shoppingListItems[action.shoppingListItem.shoppingList]
          )
        }
      };
    }
  ),
  on(
    ShoppingListEffectActions.undoOptimisticAddShoppingListItem,
    (state: ShoppingListState, {optimisticId, shoppingListItem}) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingListItem.shoppingList]: shoppingListItemAdapter.removeOne(
            optimisticId,
            state.shoppingListItems[shoppingListItem.shoppingList]
          )
        }
      };
    }
  ),
  on(
    ShoppingListContainerActions.deleteShoppingListItem,
    (state: ShoppingListState, {shoppingListItem}: DeleteShoppingListItemAction) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingListItem.shoppingList]: shoppingListItemAdapter.removeOne(
            shoppingListItem.id,
            state.shoppingListItems[shoppingListItem.shoppingList]
          )
        }
      };
    }
  ),
  on(
    ShoppingListContainerActions.undoDeleteShoppingListItem,
    ShoppingListEffectActions.undoOptimisticDeleteShoppingListItem,
    (state: ShoppingListState, {shoppingListItem}) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingListItem.shoppingList]: shoppingListItemAdapter.addOne(
            shoppingListItem,
            state.shoppingListItems[shoppingListItem.shoppingList]
          )
        }
      };
    }
  ),
  on(
    ShoppingListEffectActions.bulkUpdateShoppingListItems,
    (state: ShoppingListState, {shoppingListItems, shoppingListId}) => {
      return {
        ...state,
        shoppingListItems: {
          ...state.shoppingListItems,
          [shoppingListId]: shoppingListItemAdapter.updateMany(
            shoppingListItems.map(shoppingListItem => ({id: shoppingListItem.id, changes: shoppingListItem})),
            state.shoppingListItems[shoppingListId]
          )
        }
      };
    }
  ),*/
);
