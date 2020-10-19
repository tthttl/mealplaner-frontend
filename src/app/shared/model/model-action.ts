import { BasicShoppingListItem, Language, LoginCredentials, ShoppingList, ShoppingListItem } from './model';

export interface LoginAction {
  type: string;
  credentials: LoginCredentials;
}

export interface SetActiveShoppingListAction {
  type: string;
  id: string;
}

export interface LoadI18nAction {
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

export interface ShoppingListToggleAction {
  type: string;
  shoppingListItemId: string;
  shoppingList: string;
}
