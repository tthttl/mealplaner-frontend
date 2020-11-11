import { BasicShoppingListItem, Cookbook, Language, LoginCredentials, Recipe, ShoppingList, ShoppingListItem } from './model';

export interface LoginAction {
  type: string;
  credentials: LoginCredentials;
}

export interface SetActiveShoppingListAction {
  type: string;
  id: string;
}

export interface SetLanguageAction {
  type: string;
  language: Language;
}

export interface LoadShoppingListsSuccessAction {
  type: string;
  shoppingLists: ShoppingList[];
}

export interface SetActiveShoppingListAction {
  type: string;
  shoppingListId: string;
}

export interface LoadShoppingListItemsSuccessAction {
  type: string;
  shoppingListId: string;
  shoppingListItems: ShoppingListItem[];
}

export interface ChangeShoppingListAction {
  type: string;
  shoppingListId: string;
}

export interface AddShoppingListItemAction {
  type: string;
  optimisticId: string;
  shoppingListItem: BasicShoppingListItem;
}


export interface AddShoppingListItemSuccessAction {
  type: string;
  optimisticId: string;
  shoppingListItem: ShoppingListItem;
}

export interface DeleteShoppingListItemAction {
  type: string;
  shoppingListItem: ShoppingListItem;
}


export interface ShoppingListItemMovedAction {
  type: string;
  shoppingListId: string;
  currentIndex: number;
  previousIndex: number;
}


export interface LoadRecipeSuccessAction {
  readonly type: string;
  readonly cookbookId: string;
  readonly recipes: Recipe[];
}

export interface CreateRecipeAction {
  readonly type: string;
  readonly optimisticId: string;
  readonly recipeToSave: Recipe;
}

export interface CreateRecipeSuccessAction {
  readonly type: string;
  readonly optimisticId: string;
  readonly recipe: Recipe;
}

export interface CreateRecipeSuccessFailureAction {
  readonly type: string;
  readonly cookbookId: string;
  readonly optimisticId: string;
}

export interface EditRecipeSuccessAction {
  readonly type: string;
  readonly recipe: Recipe;
}

export interface DeleteRecipeFromStateAction {
  readonly type: string;
  readonly recipeToDelete: Recipe;
}

export interface DeleteRecipeSuccessAction {
  readonly type: string;
  readonly deletedRecipe: Recipe;
}

export interface UndoDeleteRecipeFromStateAction {
  readonly type: string;
  readonly recipe: Recipe;
}

export interface ShoppingListToggleAction {
  type: string;
  shoppingListItemId: string;
  shoppingList: string;
}

export interface CookbookSelectedAction {
  type: string;
  selectedCookbookId: string;
}

export interface CookbookCreatedAction {
  type: string;
  optimisticId: string;
  title: string;
}

export interface CookbookCreatedSuccessAction {
  type: string;
  optimisticId: string;
  cookbook: Cookbook;
}

export interface CookbookCreatedFailureAction {
  type: string;
  optimisticId: string;
}

export interface CookbookEditedSuccessAction {
  type: string;
  cookbook: Cookbook;
}

export interface CookbookDeletedFromStateAction {
  type: string;
  cookbook: Cookbook;
}

export interface UndoCookbookDeletedFromStateAction {
  type: string;
  cookbook: Cookbook;
}

export interface SetActiveCookbookIdAsQueryParamAction {
  type: string;
  selectedCookbookId: string;
}

export interface LoginFailureAction {
  type: string;
  error: string;
}
