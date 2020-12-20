import { Language, StringUnion } from '../models/model';

export const DEFAULT_LANGUAGE: Language = 'de';
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const DEFAULT_REDIRECT_URL_FOR_LOGGED_IN_USER = 'shopping-list';
export const REDIRECT_URL_WHEN_LOGOUT = '/';
export const DELETION_DELAY = 1500;
export const INPUT_DEBOUNCE_TIME = 300;
export const STORAGE_SELECTED_COOKBOOK_ID = 'selectedCookbookId';
export const STORAGE_SELECTED_SHOPPING_LIST_ID = 'selectedShoppingListId';
export const STORAGE_SELECTED_MEAL_PLANER_ID = 'selectedShoppingListId';
export const SUPPORTED_LANGUAGES = StringUnion('de', 'en');
