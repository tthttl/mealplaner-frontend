import { FormControl, FormGroup } from '@angular/forms';
import { isAfter, isDate } from 'date-fns';
import { I18n as I18nApi, UserApi } from '../../core/models/model-api';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { DEFAULT_LANGUAGE } from '../constants/constants';
import {
  BasicShoppingListItem,
  I18n as I18nClient,
  I18n,
  JwtPayload,
  Language,
  List,
  Recipe,
  SelectedIngredient,
  User
} from '../models/model';

export function mapI18nApiToI18nClient(i18nApi: I18nApi): I18nClient {
  return {
    [i18nApi.lang]: i18nApi.translations
  };
}

export function mapUserApiToUserClient(userApi: UserApi): User {
  return {
    jwt: userApi.jwt,
    id: userApi.user._id,
    name: userApi.user.name,
    email: userApi.user.email,
  };
}

export function translateValidationErrors(
  formControl: FormControl,
  translatePipe: TranslatePipe,
  translations: I18n | null,
  language: Language | null
): string[] {
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

export function addItemAlphabetically<T extends Recipe | List>(newItem: T, array: T[] = []): T[] {
  const matchingItem = array.find((element: T) => element.id === newItem.id);
  if (matchingItem) {
    return array.map((element: T) => {
      if (element.id === newItem.id) {
        return newItem;
      }
      return element;
    });
  } else {
    const indexToInsert = array.findIndex((item: T) => item.title.toLowerCase() > newItem.title.toLowerCase());
    return indexToInsert > -1 ? [...array.slice(0, indexToInsert), newItem, ...array.slice(indexToInsert)] : [...array, newItem];
  }
}


export function mapSelectedIngredientToBasicShoppingListItem(
  ingredient: SelectedIngredient,
  shoppingListId: string = ''): BasicShoppingListItem {
  return {
    amount: ingredient.amount,
    unit: ingredient.unit,
    title: ingredient.title,
    shoppingList: shoppingListId
  };
}

export function copyOrCreateArray<T extends object>(arrayMap: { [key: string]: T[] }, arrayId: string): T[] {
  return !!arrayMap[arrayId] ? [...arrayMap[arrayId]] : ([] as T[]);
}

export function isFormTouchedOrDirty(formGroup: FormGroup): boolean {
  return formGroup.touched || formGroup.dirty;
}

/* First Weekday is Monday */
export function getFirstDateOfWeek(date: Date): Date {
  const weekday = date.getDay();
  const weekStartDate = date.getDate() - weekday + (weekday === 0 ? -6 : 1);
  return new Date(date.setDate(weekStartDate));
}

/* First Weekday is Monday */
export function getWeekDayIndex(date: Date): number {
  const today = date.getDay() - 1;
  return today >= 0 ? today : 6;
}

export function stringBetweenChars(str: string, charStart: string, charEnd: string): string {
  return str.split(charStart).pop()!.split(charEnd)[0];
}
