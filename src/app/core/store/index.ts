import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { format } from 'date-fns';
import { cookbookStateReducer } from '../../features/cookbook/store/reducers/cookbook-state.reducers';
import { CookbookState, initialCookbookState } from '../../features/cookbook/store/state/cookbook-state';
import { mealPlanerStateReducers } from '../../features/meal-planer/store/reducers/meal-paner-state.reducers';
import { initialMealPlanerState, mealPlanerAdapter, MealPlanerState } from '../../features/meal-planer/store/state/meal-planer-state';
import { shoppingListReducers } from '../../features/shopping-list/store/reducers/shopping-list.reducers';
import {
  initialShoppingListState,
  shoppingListAdapter,
  shoppingListItemAdapter,
  ShoppingListState
} from '../../features/shopping-list/store/state/shopping-list-state';
import { isJwtTokenExpired } from '../helpers/helpers';
import { Cookbook, DayPlan, Recipe } from '../models/model';
import { appStateReducer } from './reducers/app-state.reducers';
import { AppState, initialAppState } from './state/app-state';

export interface GlobalState {
  appState: AppState;
  cookbookState: CookbookState;
  shoppingListState: ShoppingListState;
  mealPlanerState: MealPlanerState;
}

export const initialState: GlobalState = {
  appState: initialAppState,
  cookbookState: initialCookbookState,
  shoppingListState: initialShoppingListState,
  mealPlanerState: initialMealPlanerState,
};

export const reducers: ActionReducerMap<GlobalState> = {
  appState: appStateReducer,
  shoppingListState: shoppingListReducers,
  cookbookState: cookbookStateReducer,
  mealPlanerState: mealPlanerStateReducers,
};

export const metaReducers: MetaReducer<GlobalState>[] = [];

export const selectAppState = createFeatureSelector<GlobalState, AppState>('appState');
export const selectCookbookState =
  createFeatureSelector<GlobalState, CookbookState>('cookbookState');
export const selectShoppingListState = createFeatureSelector<GlobalState, ShoppingListState>('shoppingListState');
export const selectMealPlanerState = createFeatureSelector<GlobalState, MealPlanerState>('mealPlanerState');

export const selectTranslations = createSelector(
  selectAppState,
  (appState: AppState) => appState.i18n || {}
);

export const selectRecipes = createSelector(
  selectCookbookState,
  (cookbookState: CookbookState) => cookbookState.recipes
);

export const selectCurrentLanguage = createSelector(
  selectAppState,
  (appState: AppState) => appState.language
);

export const selectUser = createSelector(
  selectAppState,
  (appState: AppState) => appState.user
);

export const selectRequestedUrlBeforeLoginWasRequired = createSelector(
  selectAppState,
  (appState: AppState) => appState.requestedUrlBeforeLoginWasRequired
);

export const selectUserID = createSelector(
  selectAppState,
  (appState: AppState) => appState.user?.id,
);

export const isLoggedIn = createSelector(
  selectAppState,
  (appState: AppState) => !!appState.user && !isJwtTokenExpired(appState.user.jwt)
);

export const selectShoppingListsEntity = createSelector(
  selectShoppingListState,
  (shoppingListState: ShoppingListState) => shoppingListState.shoppingLists
);

export const selectShoppingLists = shoppingListAdapter.getSelectors(selectShoppingListsEntity).selectAll;

export const activeShoppingList = createSelector(
  selectShoppingListState,
  (shoppingListState: ShoppingListState) => shoppingListState.shoppingLists.entities[shoppingListState.activeShoppingList || '']
);

export const activeShoppingListId = createSelector(
  selectShoppingListState,
  (shoppingListState: ShoppingListState) => shoppingListState.activeShoppingList
);

export const isActiveShoppingListLoading = createSelector(
  selectShoppingListState,
  (shoppingListState: ShoppingListState) => shoppingListState.activeShoppingList
);


export const selectCurrentShoppingListEntity = createSelector(
  selectShoppingListState,
  (shoppingListState: ShoppingListState) => {
    if (!shoppingListState.activeShoppingList) {
      return shoppingListItemAdapter.getInitialState();
    }

    const items = shoppingListState.shoppingListItems[shoppingListState.activeShoppingList];

    if (!items) {
      return shoppingListItemAdapter.getInitialState();
    }

    return items;
  },
);

export const selectCurrentShoppingListItems = shoppingListItemAdapter.getSelectors(selectCurrentShoppingListEntity).selectAll;

export const selectCookbooks = createSelector(
  selectCookbookState,
  (cookbookState: CookbookState) => cookbookState.cookbooks);

export const selectActiveCookbookId = createSelector(
  selectCookbookState,
  (cookbookState: CookbookState) => cookbookState.activeCookbookId);

export const selectedCookbook = createSelector(
  selectCookbookState,
  (cookbookState: CookbookState) => {
    if (cookbookState.activeCookbookId) {
      return cookbookState.cookbooks.find((cookbook: Cookbook) => cookbook.id === cookbookState.activeCookbookId);
    } else {
      return cookbookState.cookbooks[0];
    }
  });

export const selectedRecipe = (selectedCookbookId: string, recipeId: string) => createSelector(
  (state: GlobalState) => state.cookbookState,
  (cookbookState: CookbookState) => {
    const recipesOfCookbook = cookbookState.recipes[selectedCookbookId];
    if (recipesOfCookbook) {
      return recipesOfCookbook.find((recipe: Recipe) => recipe.id === recipeId);
    }
    return undefined;
  });

export const selectActiveCookbookRecipes = createSelector(
  (state: GlobalState) => state.cookbookState,
  (cookbookState: CookbookState) => {
    if (!cookbookState.activeCookbookId) {
      return undefined;
    }

    return cookbookState.recipes[cookbookState.activeCookbookId];
  });

export const selectSelectedDate = createSelector(
  selectMealPlanerState,
  (mealPlanerState: MealPlanerState) => mealPlanerState.selectedDate);

export const selectMealPlanerEntity = createSelector(
  selectMealPlanerState,
  (mealPlanerState: MealPlanerState) => mealPlanerState.mealPlaners
);

export const selectMealPlaners = mealPlanerAdapter.getSelectors(selectMealPlanerEntity).selectAll;

export const activeMealPlaner = createSelector(
  selectMealPlanerState,
  (mealPlanerState: MealPlanerState) => mealPlanerState.mealPlaners.entities[mealPlanerState.activeMealPlaner || '']
);

export const activeMealPlanerId = createSelector(
  selectMealPlanerState,
  (mealPlanerState: MealPlanerState) => mealPlanerState.activeMealPlaner
);

export const isActiveMealPlanerLoading = createSelector(
  selectMealPlanerState,
  (mealPlanerState: MealPlanerState) => mealPlanerState.activeMealPlaner
);

export const activeDayPlan = createSelector(
  selectMealPlanerState,
  (mealPlanerState: MealPlanerState) => {
    const currentMealPlaner = mealPlanerState.activeMealPlaner;
    if (!currentMealPlaner) {
      return null;
    }
    const currentMeals = mealPlanerState.meals[currentMealPlaner] as { [key: string]: DayPlan };
    if (!currentMeals) {
      return null;
    }
    const currentDayPlan = currentMeals[format(mealPlanerState.selectedDate, 'yyyy-MM-dd')];
    if (!currentDayPlan) {
      return null;
    }
    return currentDayPlan;
  }
);

export const isOffline = createSelector(
  selectAppState,
  (appState: AppState) => appState.isOffline
);
