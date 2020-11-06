import { FormControl } from '@angular/forms';
import { isAfter, isDate } from 'date-fns';
import { TranslatePipe } from '../../i18n/pipes/translate.pipe';
import {
  BasicShoppingListItem,
  Cookbook,
  I18n as I18nClient,
  I18n,
  JwtPayload,
  Language,
  List,
  Recipe,
  RecipeIngredient,
  SelectedIngredient,
  ShoppingListItem as ShoppingListItemClient,
  User
} from '../../shared/model/model';
import {
  CookbookApi,
  I18n as I18nApi,
  IngredientApi,
  RecipeApi,
  ShoppingListItemApi as ShoppingListItemApi,
  UserApi
} from '../../shared/model/model-api';
import { DEFAULT_LANGUAGE } from './constants';

export function mapI18nApiToI18nClient(i18nApi: I18nApi): I18nClient {
  return {
    [i18nApi.lang]: i18nApi.translations
  };
}

export function mapUserApiToUserClient(userApi: UserApi): User {
  return {
    jwt: userApi.jwt,
    id: userApi.user._id,
    name: userApi.user.username,
    email: userApi.user.email,
  };
}

export function translateValidationErrors(formControl: FormControl,
                                          translatePipe: TranslatePipe,
                                          translations: I18n | null,
                                          language: Language | null): string[] {
  if (formControl.invalid && formControl.errors && formControl.touched) {
    return Object.keys(formControl.errors).map(error => translatePipe
      .transform(`errors.validation.${error}`, translations || {}, language || DEFAULT_LANGUAGE));
  }
  return [];
}


export function decodeJwtToken(token: string): JwtPayload {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map((c: string) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export function isJwtTokenExpired(token: string, now: Date = new Date()): boolean {
  const {exp} = decodeJwtToken(token);
  const tokenExpirationDate: Date = new Date(exp * 1000);

  if (!isDate(tokenExpirationDate)) {
    return true;
  }

  return isAfter(now, tokenExpirationDate);
}

export function moveItemInArray<T>(array: T[], previousIndex: number, currentIndex: number): T[] {
  const copy = [...array];
  const element = array[previousIndex];
  copy.splice(previousIndex, 1);
  copy.splice(currentIndex, 0, element);
  return copy;
}

export function convertRecipesApiToRecipes(recipes: RecipeApi[]): Recipe[] {
  return recipes.map((recipe: RecipeApi) => convertRecipeApiToRecipe(recipe));
}

export function convertRecipeApiToRecipe(recipe: RecipeApi): Recipe {
  return {
    id: recipe.id,
    title: recipe.title,
    url: recipe.url,
    cookbookId: recipe.cookbookId,
    ingredients: convertIngredientApiArrayToRecipeIngredientArray(recipe.ingredients)
  };
}

export function convertIngredientApiArrayToRecipeIngredientArray(ingredients: IngredientApi[]): RecipeIngredient[] {
  return ingredients.map((ingredient: IngredientApi) => {
    return {
      id: ingredient.id,
      title: ingredient.title,
      unit: ingredient.unit,
      amount: ingredient.amount,
      isStapleFood: ingredient.isStapleFood || false
    };
  });
}

export function convertCookbookApisToCookbooks(cookbooks: CookbookApi[]): Cookbook[] {
  return cookbooks.map((cookbook: CookbookApi) => convertCookbookApiToCookbook(cookbook));
}

export function convertCookbookApiToCookbook(cookbook: CookbookApi): Cookbook {
  return {
    id: cookbook.id,
    title: cookbook.title
  };
}

export function sortAlphabetically(a: string, b: string): number {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}

export function addItemAtIndex<T extends Recipe | List>(newItem: T, items: T[]): T[] {
  const indexToInsert = items.findIndex((item: T) => item.title.toLowerCase() > newItem.title.toLowerCase());
  return indexToInsert > -1 ? [...items.slice(0, indexToInsert), newItem, ...items.slice(indexToInsert)] : [...items, newItem];
}

export function mapShoppingListItemApiToShoppingListItem(shoppingListApi: ShoppingListItemApi): ShoppingListItemClient {
  return {
    ...shoppingListApi,
    isChecked: false,
  };
}

export function mapSelectedIngredientToBasicShoppingListItem(ingredient: SelectedIngredient, shoppingListId: string = ''):
  BasicShoppingListItem {
  return {
    amount: ingredient.amount,
    unit: ingredient.unit,
    title: ingredient.title,
    shoppingList: shoppingListId
  };
}

export function copyOrCreateArray<T extends object>(arrayMap: {[key: string]: T[]}, arrayId: string): T[]{
  return !!arrayMap[arrayId] ? [...arrayMap[arrayId]] : ([] as T[]);
}
