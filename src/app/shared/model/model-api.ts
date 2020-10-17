import { Unit } from './model';

export type I18n = {
  readonly lang: string;
  readonly translations: Translations;
};

export interface Translations {
  readonly [key: string]: string;
}

export interface UserApi {
  jwt: string;
  user: {
    username: string,
    email: string
  };
}

export interface RecipeApi {
  readonly id: string;
  readonly title: string;
  readonly url?: string;
  readonly cookbookId: string;
  readonly ingredients: IngredientApi[];
}

export interface IngredientApi {
  readonly id: string;
  readonly title: string;
  readonly unit: Unit;
  readonly amount: number;
  readonly isStapleFood: boolean;
}

export interface CookbookApi {
  readonly id: string;
  readonly title: string;
}
