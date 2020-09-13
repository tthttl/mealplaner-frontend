export type I18n = {
  readonly [key: string]: Translations;
};

export interface Translations {
  readonly [key: string]: string;
}

export type Language = 'de' | 'en';

export type Unit = 'kg' | 'g' | 'tableSpoon' | 'coffeeSpoon' | 'l' | 'dl' | 'ml' | 'pinch' | 'piece';

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
