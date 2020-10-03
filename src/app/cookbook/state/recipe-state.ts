import { Recipe } from '../../shared/model/model';

export interface RecipeState {
  readonly recipes: Recipe[];
}

export const initialRecipeState: RecipeState = {
  recipes: []
};
