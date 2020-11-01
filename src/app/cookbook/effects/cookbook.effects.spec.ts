import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { Cookbook, Recipe } from '../../shared/model/model';
import { GlobalState, initialState } from '../../shared/state';
import { CookbookApiActions, CookbookContainerActions } from '../actions';
import { CookbookService } from '../services/cookbook.service';
import { RecipeService } from '../services/recipe.service';
import { CookbookEffects } from './cookbook.effects';
import SpyObj = jasmine.SpyObj;

let cookbookService: SpyObj<CookbookService>;
let router: SpyObj<Router>;
let store: Store<GlobalState>;
let recipeService: SpyObj<RecipeService>;
let activatedRoute: Partial<ActivatedRoute>;

describe('Cookbook Effects', () => {

  let cookbookEffects: CookbookEffects;

  const recipeA: Partial<Recipe> = {
    id: '1',
    title: 'Recipe A',
    cookbookId: 'cookbookId'
  };

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
    recipeService = jasmine.createSpyObj('RecipeService', ['loadRecipes', 'saveRecipe', 'editRecipe', 'deleteRecipe']);
    cookbookService = jasmine.createSpyObj('CookbookService', ['loadCookbooks']);
    activatedRoute = {
      snapshot: {
        queryParams: {
          selectedCookbookId: 'cookbookId'
        } as Params
      }
    } as ActivatedRoute;
  });

  it('loadCookbooks should return success action', () => {
    cookbookEffects = createEffects(CookbookContainerActions.loadCookbook.type);
    cookbookService.loadCookbooks.and.returnValue(of([] as Cookbook[]));
    cookbookEffects.loadCookbooks$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.loadCookbookSuccess.type);
    });
  });

  it('loadCookbooks should return failure action', () => {
    cookbookEffects = createEffects(CookbookContainerActions.loadCookbook.type);
    cookbookService.loadCookbooks.and.returnValue(throwError('error'));
    cookbookEffects.loadCookbooks$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.loadCookbookFailure.type);
    });
  });


  it('loadRecipes should return success action', () => {
    cookbookEffects = createEffects(CookbookContainerActions.loadRecipes.type);
    recipeService.loadRecipes.and.returnValue(of([] as Recipe[]));
    cookbookEffects.loadRecipes$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.loadRecipesSuccess.type);
    });
  });

  it('loadRecipes should return failure action', () => {
    cookbookEffects = createEffects(CookbookContainerActions.loadRecipes.type);
    recipeService.loadRecipes.and.returnValue(throwError('error'));
    cookbookEffects.loadRecipes$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.loadRecipesFailure.type);
    });
  });

  it('loadRecipes should return success action when triggered by loadCookbookSuccess', () => {
    cookbookEffects = createEffects(CookbookApiActions.loadCookbookSuccess.type);
    recipeService.loadRecipes.and.returnValue(of([] as Recipe[]));
    cookbookEffects.loadRecipes$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.loadRecipesSuccess.type);
    });
  });

  it('loadRecipes should return failure action when triggered by loadCookbookSuccess', () => {
    cookbookEffects = createEffects(CookbookApiActions.loadCookbookSuccess.type);
    recipeService.loadRecipes.and.returnValue(throwError('error'));
    cookbookEffects.loadRecipes$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.loadRecipesFailure.type);
    });
  });

  it('saveRecipe should return success action', () => {
    cookbookEffects = createEffects(CookbookContainerActions.createRecipe.type);
    recipeService.saveRecipe.and.returnValue(of({} as Recipe));
    cookbookEffects.saveRecipe$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.createRecipeSuccess.type);
    });
  });

  it('saveRecipe should return failure action', () => {
    cookbookEffects = createEffects(CookbookContainerActions.createRecipe.type);
    recipeService.saveRecipe.and.returnValue(throwError('error'));
    cookbookEffects.saveRecipe$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.createRecipeFailure.type);
    });
  });

  it('editRecipe should return success action', () => {
    cookbookEffects = createEffects(CookbookContainerActions.editRecipe.type);
    recipeService.editRecipe.and.returnValue(of({} as Recipe));
    cookbookEffects.editRecipe$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.editRecipeSuccess.type);
    });
  });

  it('editRecipe should return failure action', () => {
    cookbookEffects = createEffects(CookbookContainerActions.editRecipe.type);
    recipeService.editRecipe.and.returnValue(throwError('error'));
    cookbookEffects.editRecipe$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.editRecipeFailure.type);
    });
  });

  it('deleteRecipe should return success action', () => {
    cookbookEffects = createEffects(CookbookContainerActions.deleteRecipe.type, recipeA as Recipe);
    recipeService.deleteRecipe.and.returnValue(of(true));
    cookbookEffects.deleteRecipe$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.deleteRecipeSuccess.type);
    });
  });

  it('deleteRecipe should return failure action', () => {
    cookbookEffects = createEffects(CookbookContainerActions.deleteRecipe.type, recipeA as Recipe);
    recipeService.deleteRecipe.and.returnValue(throwError('error'));
    cookbookEffects.deleteRecipe$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.undoDeleteRecipeFromState.type);
    });
  });

  it('should navigate to cookbook on createRecipeSuccess', () => {
    cookbookEffects = createEffects(CookbookApiActions.createRecipeSuccess.type);
    cookbookEffects.navigateToCookbook$.subscribe(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/cookbook']);
    });
  });

  it('should navigate to cookbook on editRecipeSuccess', () => {
    cookbookEffects = createEffects(CookbookApiActions.editRecipeSuccess.type);
    cookbookEffects.navigateToCookbook$.subscribe(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/cookbook']);
    });
  });
});


function createEffects(actionType: string, recipe?: Recipe): CookbookEffects {
  let actions$: Observable<Action>;
  if (recipe) {
    actions$ = of({type: actionType, recipe});
  } else {
    actions$ = of({type: actionType});
  }
  return new CookbookEffects(
    actions$,
    cookbookService,
    store,
    recipeService,
    router,
    activatedRoute as ActivatedRoute
  );
}
