import { SUPPORTED_LANGUAGES } from '../constants/constants';

export type I18n = {
  readonly [key: string]: Translations;
};

export interface Translations {
  readonly [key: string]: string;
}

export type Language = typeof SUPPORTED_LANGUAGES.type;

export type Unit = 'kg' | 'g' | 'tableSpoon' | 'coffeeSpoon' | 'l' | 'dl' | 'ml' | 'pinch' | 'piece' | 'pack';

export interface Ingredient {
  title: string;
  amount: number;
  unit: Unit;
}

export interface ShoppingList {
  id: string;
  title: string;
  isInitialized?: boolean;
}

export interface List {
  id: string;
  title: string;
}

export interface ShoppingListItem extends Ingredient {
  id: string;
  shoppingList: string;
  order?: number;
}

export type BasicShoppingListItem = Omit<ShoppingListItem, 'id' | 'order'>;

export interface AddShoppingListItemEvent {
  shoppingListId: string;
  shoppingListItem: ShoppingListItem;
}

export interface DeleteShoppingListItemEvent {
  shoppingListId: string;
  shoppingListItem: ShoppingListItem;
}

export interface ArrayItemMovedEvent {
  currentIndex: number;
  previousIndex: number;
}

export interface ShoppingListItemMovedEvent extends ArrayItemMovedEvent {
  shoppingListId: string;
}

export interface SelectOption<T> {
  value: T;
  key?: string;
  name?: string;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  invitationCode: string;
}

export interface User {
  jwt: string;
  id: string;
  name: string;
  email: string;
}

export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export interface JwtRefreshResponse {
  ok: boolean;
  user: User | null;
}

// TypeScript will infer a string union type from the literal values passed to
// this function. Without `extends string`, it would instead generalize them
// to the common string type.
export const StringUnion = <UnionType extends string>(...values: UnionType[]) => {
  Object.freeze(values);
  const valueSet: Set<string> = new Set(values);

  const guard = (value: string): value is UnionType => {
    return valueSet.has(value);
  };

  const check = (value: string): UnionType => {
    if (!guard(value)) {
      const actual = JSON.stringify(value);
      const expected = values.map(s => JSON.stringify(s)).join(' | ');
      throw new TypeError(`Value '${actual}' is not assignable to type '${expected}'.`);
    }
    return value;
  };

  const unionNamespace = {guard, check, values};
  return Object.freeze(unionNamespace as typeof unionNamespace & { type: UnionType });
};

export interface RecipeIngredient extends Ingredient {
  id?: string;
  readonly isStapleFood: boolean;
}

export interface Recipe {
  id?: string;
  title: string;
  cookbookId: string;
  ingredients: RecipeIngredient [];
  url?: string;
}

export interface DialogData<T extends object> {
  readonly data: T;
  readonly translations: {[key: string]: string};
}

export interface Cookbook {
  readonly id: string;
  readonly title: string;
}

export interface ListPickerDialogEvent {
  event: 'select' | 'create' | 'edit' | 'delete';
  list?: List;
}

export interface CreateListDialogEvent {
  event: 'create';
  title: string;
}

export interface EditListDialogEvent {
  event: 'edit';
  list: List;
}

export interface SelectedIngredient extends Ingredient {
  isSelected: boolean;
}

export interface RecipeViewDialogEvent {
  readonly event: 'selectedIngredients' | 'recipe';
  readonly recipe?: Recipe;
  readonly selectedIngredients?: SelectedIngredient[];
}
