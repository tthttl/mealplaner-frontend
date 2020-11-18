import { Cookbook, Recipe } from '../../../../core/models/model';
import { CookbookApiActions, CookbookContainerActions } from '../actions';
import { initialCookbookState } from '../state/cookbook-state';
import { cookbookStateReducer } from './cookbook-state.reducers';

describe('CookbookState Reducer', () => {

  const cookbookId = 'cookbookId';

  const cookbook: Cookbook = {
    id: '1',
    title: 'cookbook'
  };

  const recipeA: Partial<Recipe> = {
    id: '1',
    title: 'Recipe A',
    cookbookId
  };

  const recipeB: Partial<Recipe> = {
    id: '2',
    title: 'Recipe B',
    cookbookId
  };

  const recipes: Recipe[] = [recipeA as Recipe, recipeB as Recipe];

  const cookbooks: Cookbook[] = [cookbook as Cookbook];

  it(`${CookbookApiActions.loadCookbookSuccess}`, () => {
    expect(cookbookStateReducer(
      {...initialCookbookState},
      CookbookApiActions.loadCookbookSuccess({cookbooks})
    )).toEqual({
      ...initialCookbookState,
      activeCookbookId: cookbooks[0].id,
      cookbooks
    });
  });

  describe(`${CookbookApiActions.loadRecipesSuccess}`, () => {
    it('should load recipes', () => {
      expect(cookbookStateReducer(
        {...initialCookbookState},
        CookbookApiActions.loadRecipesSuccess({cookbookId, recipes}))
      ).toEqual({
        ...initialCookbookState,
        recipes: {
          cookbookId: recipes
        }
      });
    });
  });

  describe(`${CookbookContainerActions.createRecipe}`, () => {
    it('should add new Recipe with optimisticId', () => {
      expect(cookbookStateReducer(
        {
          ...initialCookbookState, recipes: {
            cookbookId: []
          }
        },
        CookbookContainerActions.createRecipe({optimisticId: 'optimisticId', recipeToSave: recipeA as Recipe}))
      ).toEqual({
        ...initialCookbookState,
        recipes: {
          cookbookId: [{...recipeA, id: 'optimisticId'} as Recipe]
        }
      });
    });
  });

  describe(`${CookbookApiActions.createRecipeSuccess}`, () => {
    it('should override optimisticId', () => {
      expect(cookbookStateReducer(
        {
          ...initialCookbookState, recipes: {
            cookbookId: [{...recipeA, id: 'optimisticId'} as Recipe]
          }
        },
        CookbookApiActions.createRecipeSuccess({optimisticId: 'optimisticId', recipe: recipeA as Recipe}))
      ).toEqual({
        ...initialCookbookState,
        recipes: {
          cookbookId: [recipeA as Recipe]
        }
      });
    });
  });

  describe(`${CookbookApiActions.editRecipeSuccess}`, () => {
    it('should modify existing Recipe', () => {
      expect(cookbookStateReducer(
        {
          ...initialCookbookState, recipes: {
            cookbookId: [recipeA as Recipe]
          }
        },
        CookbookApiActions.editRecipeSuccess(
          {recipe: {id: '1', title: 'modified', cookbookId} as Recipe}))
      ).toEqual({
        ...initialCookbookState,
        recipes: {
          cookbookId: [{id: '1', title: 'modified', cookbookId} as Recipe]
        }
      });
    });

  });

  describe(`${CookbookContainerActions.deleteRecipeFromState}`, () => {
    it('should delete existing Recipe', () => {
      expect(cookbookStateReducer(
        {
          ...initialCookbookState, recipes: {
            cookbookId: [recipeA as Recipe]
          }
        },
        CookbookContainerActions.deleteRecipeFromState({recipeToDelete: recipeA as Recipe}))
      ).toEqual({
        ...initialCookbookState,
        recipes: {
          cookbookId: []
        }
      });
    });
  });

  describe(`${CookbookApiActions.undoDeleteRecipeFromState}`, () => {
    it('should undo deleting existing Recipe', () => {
      expect(cookbookStateReducer(
        {
          ...initialCookbookState, recipes: {
            cookbookId: []
          }
        },
        CookbookApiActions.undoDeleteRecipeFromState({recipe: recipeA as Recipe}))
      ).toEqual({
        ...initialCookbookState,
        recipes: {
          cookbookId: [recipeA as Recipe]
        }
      });
    });
  });

  describe(`${CookbookContainerActions.selectCookbook}`, () => {
    it('should set activeCookbookId', () => {
      expect(cookbookStateReducer(
        {
          ...initialCookbookState,
          activeCookbookId: 'formerId'
        },
        CookbookContainerActions.selectCookbook({selectedCookbookId: 'newId'}))
      ).toEqual({
        ...initialCookbookState,
        activeCookbookId: 'newId'
      });
    });
  });

  describe(`${CookbookContainerActions.createCookbook}`, () => {
    it('should add new cookbook with optimistic id', () => {
      expect(cookbookStateReducer(
        {
          ...initialCookbookState,
          cookbooks: []
        },
        CookbookContainerActions.createCookbook({optimisticId: '1', title: 'dummyTitle'}))
      ).toEqual({
        ...initialCookbookState,
        cookbooks: [{id: '1', title: 'dummyTitle'}]
      });
    });
  });

  describe(`${CookbookApiActions.createCookbookSuccess}`, () => {
    it('should override cookbook with optimistic id', () => {
      expect(cookbookStateReducer(
        {
          ...initialCookbookState,
          cookbooks: [{id: '1', title: 'dummyTitle'}]
        },
        CookbookApiActions.createCookbookSuccess({optimisticId: '1', cookbook}))
      ).toEqual({
        ...initialCookbookState,
        cookbooks: [{id: '1', title: 'cookbook'}]
      });
    });
  });

  describe(`${CookbookApiActions.createCookbookFailure}`, () => {
    it('should remove cookbook with optimistic id', () => {
      expect(cookbookStateReducer(
        {
          ...initialCookbookState,
          cookbooks: [{id: '1', title: 'dummyTitle'}]
        },
        CookbookApiActions.createCookbookFailure({optimisticId: '1'}))
      ).toEqual({
        ...initialCookbookState,
        cookbooks: []
      });
    });
  });

  describe(`${CookbookApiActions.editCookbookSuccess}`, () => {
    it('should update cookbook with matching id', () => {
      expect(cookbookStateReducer(
        {
          ...initialCookbookState,
          cookbooks: [{id: '1', title: 'dummyTitle'}]
        },
        CookbookApiActions.editCookbookSuccess({cookbook}))
      ).toEqual({
        ...initialCookbookState,
        cookbooks: [cookbook]
      });
    });
  });

  describe(`${CookbookContainerActions.deleteCookbookFromState}`, () => {
    it('should delete cookbook from state', () => {
      expect(cookbookStateReducer(
        {
          ...initialCookbookState,
          cookbooks: [{id: '1', title: 'dummyTitle'}]
        },
        CookbookContainerActions.deleteCookbookFromState({cookbook}))
      ).toEqual({
        ...initialCookbookState,
        cookbooks: []
      });
    });
  });

  describe(`${CookbookApiActions.undoDeleteCookbookFromState}`, () => {
    it('should undo delete cookbook from state', () => {
      expect(cookbookStateReducer(
        {
          ...initialCookbookState,
          cookbooks: []
        },
        CookbookApiActions.undoDeleteCookbookFromState({cookbook}))
      ).toEqual({
        ...initialCookbookState,
        cookbooks: [cookbook]
      });
    });
  });
});
