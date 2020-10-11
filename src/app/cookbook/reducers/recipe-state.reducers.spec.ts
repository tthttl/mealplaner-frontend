import { Recipe } from '../../shared/model/model';
import { RecipeApiActions, RecipeStateActions } from '../actions';
import { initialRecipeState } from '../state/recipe-state';
import { recipeStateReducer } from './recipe-state.reducers';

describe('Recipe State Reducers', () => {

  const recipeA: Partial<Recipe> = {
    id: '1',
    title: 'Recipe A'
  };

  const recipeB: Partial<Recipe> = {
    id: '2',
    title: 'Recipe B'
  };

  const recipes: Recipe[] = [recipeA as Recipe, recipeB as Recipe];

  describe(`${RecipeApiActions.loadRecipesSuccess}`, () => {
    it('should load recipes', () => {
      expect(recipeStateReducer(
        {...initialRecipeState},
        RecipeApiActions.loadRecipesSuccess({recipes}))
      ).toEqual({
        ...initialRecipeState,
        recipes
      });
    });
  });

  describe(`${RecipeApiActions.createRecipeSuccess}`, () => {
    it('should add new Recipe', () => {
      expect(recipeStateReducer(
        {...initialRecipeState},
        RecipeApiActions.createRecipeSuccess({savedRecipe: recipeA as Recipe}))
      ).toEqual({
        ...initialRecipeState,
        recipes: [recipeA as Recipe]
      });
    });

  });

  describe(`${RecipeApiActions.editRecipeSuccess}`, () => {
    it('should modify existing Recipe', () => {
      expect(recipeStateReducer(
        {...initialRecipeState, recipes: [recipeA as Recipe]},
        RecipeApiActions.editRecipeSuccess(
          {editedRecipe: {id: '1', title: 'modified'} as Recipe}))
      ).toEqual({
        ...initialRecipeState,
        recipes: [{id: '1', title: 'modified'} as Recipe]
      });
    });

  });

  describe(`${RecipeStateActions.deleteRecipeFromState}`, () => {
    it('should delete existing Recipe', () => {
      expect(recipeStateReducer(
        {...initialRecipeState, recipes: [recipeA as Recipe]},
        RecipeStateActions.deleteRecipeFromState({recipeId: '1'}))
      ).toEqual({
        ...initialRecipeState,
        recipes: []
      });
    });
  });
});
