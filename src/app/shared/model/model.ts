export type I18n = {
  readonly [key: string]: Translations;
};

export interface Translations {
  readonly [key: string]: string;
}

export type Language = 'de' | 'en';

export type Unit = 'kg' | 'g' | 'tableSpoon' | 'coffeeSpoon' | 'l' | 'dl' | 'ml' | 'pinch' | 'piece' | 'pack';

export interface Ingredient {
  name: string;
  amount: number;
  unit: Unit;
}

export interface ShoppingListItem extends Ingredient{
  id: string;
  isChecked: boolean;
}

export interface ArrayItemMovedEvent {
  currentIndex: number;
  previousIndex: number;
}

export interface SelectOption<T extends object | string> {
  value: T | string;
  key?: string;
  name?: string;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface User {
  jwt: string;
  name: string;
  email: string;
}

export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export interface JwtRenewal {
  success: boolean;
  jwt: string;
}
