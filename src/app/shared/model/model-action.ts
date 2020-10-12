import { Language, LoginCredentials } from './model';

export interface LoginAction {
  type: string;
  credentials: LoginCredentials;
}

export interface SetActiveShoppingList {
  type: string;
  id: string;
}

export interface LoadI18nAction {
  type: string;
  language: Language;
}
