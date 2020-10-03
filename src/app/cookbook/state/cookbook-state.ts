import { Cookbook } from '../../shared/model/model';

export interface CookbookState {
  readonly activeCookbookId: string;
  readonly cookbooks: Cookbook[];
}

export const initialCookbookState: CookbookState = {
  activeCookbookId: '',
  cookbooks: []
};
