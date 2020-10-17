import { Cookbook, Recipe } from '../../shared/model/model';

export interface CookbookState {
  readonly activeCookbookId: string;
  readonly cookbooks: Cookbook[];
  readonly recipes: {
    [cookbookId: string]: Recipe[]
  };
}

export const initialCookbookState: CookbookState = {
  activeCookbookId: '',
  cookbooks: [],
  recipes: {}
};
