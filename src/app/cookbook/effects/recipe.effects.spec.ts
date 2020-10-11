import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { Recipe } from '../../shared/model/model';
import { GlobalState, initialState } from '../../shared/state';
import { CookbookApiActions, RecipeApiActions } from '../actions';
import { RecipeService } from '../services/recipe.service';
import { RecipeEffects } from './recipe.effects';
import SpyObj = jasmine.SpyObj;

let router: SpyObj<Router>;
let store: Store<GlobalState>;
let recipeService: SpyObj<RecipeService>;

describe('Recipe Effects', () => {

  let recipeEffects: RecipeEffects;

  class StoreMock {
    select = jasmine.createSpy().and.returnValue(of({}));
    dispatch = jasmine.createSpy();
    pipe = jasmine.createSpy().and.returnValue(of('success'));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Store,
          userValue: StoreMock
        },
        provideMockStore({initialState}),
      ]
    });

    store = TestBed.inject(Store);
    router = jasmine.createSpyObj('Router', ['navigate']);
  });

  it('loadRecipes should return success action', () => {
    recipeEffects = createEffects(RecipeApiActions.loadRecipes.type, 'loadRecipes');
    recipeService.loadRecipes.and.returnValue(of([] as Recipe[]));
    recipeEffects.loadRecipes.subscribe((action: Action) => {
      expect(action.type).toEqual(RecipeApiActions.loadRecipesSuccess.type);
    });
  });

  it('loadRecipes should return failure action', () => {
    recipeEffects = createEffects(RecipeApiActions.loadRecipes.type, 'loadRecipes');
    recipeService.loadRecipes.and.returnValue(throwError('error'));
    recipeEffects.loadRecipes.subscribe((action: Action) => {
      expect(action.type).toEqual(RecipeApiActions.loadRecipesFailure.type);
    });
  });

  it('loadRecipes should return success action when triggered by deleteRecipeFailure', () => {
    recipeEffects = createEffects(RecipeApiActions.deleteRecipeFailure.type, 'loadRecipes');
    recipeService.loadRecipes.and.returnValue(of([] as Recipe[]));
    recipeEffects.loadRecipes.subscribe((action: Action) => {
      expect(action.type).toEqual(RecipeApiActions.loadRecipesSuccess.type);
    });
  });

  it('loadRecipes should return failure action when triggered by deleteRecipeFailure', () => {
    recipeEffects = createEffects(RecipeApiActions.deleteRecipeFailure.type, 'loadRecipes');
    recipeService.loadRecipes.and.returnValue(throwError('error'));
    recipeEffects.loadRecipes.subscribe((action: Action) => {
      expect(action.type).toEqual(RecipeApiActions.loadRecipesFailure.type);
    });
  });

  it('loadRecipes should return success action when triggered by loadCookbookSuccess', () => {
    recipeEffects = createEffects(CookbookApiActions.loadCookbookSuccess.type, 'loadRecipes');
    recipeService.loadRecipes.and.returnValue(of([] as Recipe[]));
    recipeEffects.loadRecipes.subscribe((action: Action) => {
      expect(action.type).toEqual(RecipeApiActions.loadRecipesSuccess.type);
    });
  });

  it('loadRecipes should return failure action when triggered by loadCookbookSuccess', () => {
    recipeEffects = createEffects(CookbookApiActions.loadCookbookSuccess.type, 'loadRecipes');
    recipeService.loadRecipes.and.returnValue(throwError('error'));
    recipeEffects.loadRecipes.subscribe((action: Action) => {
      expect(action.type).toEqual(RecipeApiActions.loadRecipesFailure.type);
    });
  });

  it('saveRecipe should return success action', () => {
    recipeEffects = createEffects(RecipeApiActions.createRecipe.type, 'saveRecipe');
    recipeService.saveRecipe.and.returnValue(of({} as Recipe));
    recipeEffects.saveRecipe.subscribe((action: Action) => {
      expect(action.type).toEqual(RecipeApiActions.createRecipeSuccess.type);
    });
  });

  it('saveRecipe should return failure action', () => {
    recipeEffects = createEffects(RecipeApiActions.createRecipe.type, 'saveRecipe');
    recipeService.saveRecipe.and.returnValue(throwError('error'));
    recipeEffects.saveRecipe.subscribe((action: Action) => {
      expect(action.type).toEqual(RecipeApiActions.createRecipeFailure.type);
    });
  });

  it('editRecipe should return success action', () => {
    recipeEffects = createEffects(RecipeApiActions.editRecipe.type, 'editRecipe');
    recipeService.editRecipe.and.returnValue(of({} as Recipe));
    recipeEffects.editRecipe.subscribe((action: Action) => {
      expect(action.type).toEqual(RecipeApiActions.editRecipeSuccess.type);
    });
  });

  it('editRecipe should return failure action', () => {
    recipeEffects = createEffects(RecipeApiActions.editRecipe.type, 'editRecipe');
    recipeService.editRecipe.and.returnValue(throwError('error'));
    recipeEffects.editRecipe.subscribe((action: Action) => {
      expect(action.type).toEqual(RecipeApiActions.editRecipeFailure.type);
    });
  });

  it('deleteRecipe should return success action', () => {
    recipeEffects = createEffects(RecipeApiActions.deleteRecipe.type, 'deleteRecipe');
    recipeService.deleteRecipe.and.returnValue(of('DELETE'));
    recipeEffects.deleteRecipe.subscribe((action: Action) => {
      expect(action.type).toEqual(RecipeApiActions.deleteRecipeSuccess.type);
    });
  });

  it('deleteRecipe should return failure action', () => {
    recipeEffects = createEffects(RecipeApiActions.deleteRecipe.type, 'deleteRecipe');
    recipeService.deleteRecipe.and.returnValue(throwError('error'));
    recipeEffects.deleteRecipe.subscribe((action: Action) => {
      expect(action.type).toEqual(RecipeApiActions.deleteRecipeFailure.type);
    });
  });

  it('should navigate to cookbook on createRecipeSuccess', () => {
    recipeEffects = createEffects(RecipeApiActions.createRecipeSuccess.type, '');
    recipeEffects.navigateToCookbook.subscribe(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/cookbook']);
    });
  });

  it('should navigate to cookbook on editRecipeSuccess', () => {
    recipeEffects = createEffects(RecipeApiActions.editRecipeSuccess.type, '');
    recipeEffects.navigateToCookbook.subscribe(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/cookbook']);
    });
  });

});

function createEffects(actionType: string, methodName: string): RecipeEffects {
  const actions$ = of({type: actionType});
  recipeService = jasmine.createSpyObj('RecipeService', [methodName]);

  return new RecipeEffects(
    actions$,
    recipeService,
    store,
    router
  );
}
