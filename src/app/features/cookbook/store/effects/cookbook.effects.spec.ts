import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { Cookbook, Recipe } from '../../../../core/models/model';
import { CookbookSelectedAction, SetActiveCookbookIdAsQueryParamAction } from '../../../../core/models/model-action';
import { StorageService } from '../../../../core/services/storage.service';
import { GlobalState, initialState } from '../../../../core/store';
import { CookbookService } from '../../services/cookbook.service';
import { RecipeService } from '../../services/recipe.service';
import { CookbookApiActions, CookbookContainerActions, RecipeApiActions, RecipeContainerActions } from '../actions';
import { CookbookEffects } from './cookbook.effects';
import SpyObj = jasmine.SpyObj;
import { LoadMealDialogActions } from '../../../meal-planer/store/actions';

let cookbookService: SpyObj<CookbookService>;
let router: SpyObj<Router>;
let store: MockStore;
let recipeService: SpyObj<RecipeService>;
let activatedRoute: Partial<ActivatedRoute>;
let storageService: SpyObj<StorageService>;

describe('Cookbook Effects', () => {

  let cookbookEffects: CookbookEffects;

  const recipeA: Partial<Recipe> = {
    id: '1',
    title: 'Recipe A',
    cookbookId: 'cookbookId'
  };

  const cookbook: Cookbook = {
    id: 'cookbookId',
    title: 'title'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState}),
      ]
    });

    store = TestBed.inject(MockStore);
    router = jasmine.createSpyObj('Router', ['navigate', 'routerState']);
    recipeService = jasmine.createSpyObj('RecipeService', ['loadRecipes', 'saveRecipe', 'editRecipe', 'deleteRecipe']);
    cookbookService = jasmine.createSpyObj('CookbookService', ['loadCookbooks', 'saveCookbook', 'editCookbook', 'deleteCookbook']);
    storageService = jasmine.createSpyObj('StorageService', ['setItem', 'getItem']);
    activatedRoute = {
      snapshot: {
        queryParams: {
          selectedCookbookId: 'cookbookId'
        } as Params
      }
    } as ActivatedRoute;
  });

  it('loadCookbooks should return success action', () => {
    cookbookEffects = createEffects(of({type: CookbookContainerActions.loadCookbook.type}));
    cookbookService.loadCookbooks.and.returnValue(of([] as Cookbook[]));
    cookbookEffects.loadCookbooks$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.loadCookbookSuccess.type);
    });
  });

  it('loadCookbooks should return failure action', () => {
    cookbookEffects = createEffects(of({type: CookbookContainerActions.loadCookbook.type}));
    cookbookService.loadCookbooks.and.returnValue(throwError('error'));
    cookbookEffects.loadCookbooks$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.loadCookbookFailure.type);
    });
  });


  it('loadRecipes should return success action', () => {
    cookbookEffects = createEffects(of({type: CookbookContainerActions.loadRecipes.type}));
    recipeService.loadRecipes.and.returnValue(of([{cookbookId: 'cookBookId'}] as Recipe[]));
    cookbookEffects.loadRecipes$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.loadRecipesSuccess.type);
    });
  });

  it('loadRecipes should return failure action', () => {
    cookbookEffects = createEffects(of({type: CookbookContainerActions.loadRecipes.type}));
    recipeService.loadRecipes.and.returnValue(throwError('error'));
    cookbookEffects.loadRecipes$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.loadRecipesFailure.type);
    });
  });

  it('loadSpecificRecipes should return success action', () => {
    cookbookEffects = createEffects(of({type: LoadMealDialogActions.loadRecipesForSelectedCookbook.type, id: 'cookBookId'}));
    recipeService.loadRecipes.and.returnValue(of([{cookbookId: 'cookBookId'}] as Recipe[]));
    cookbookEffects.loadSpecificRecipes$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.loadSpecificRecipesSuccess.type);
    });
  });

  it('loadSpecificRecipes should return failure action', () => {
    cookbookEffects = createEffects(of({type: LoadMealDialogActions.loadRecipesForSelectedCookbook.type, id: 'cookBookId'}));
    recipeService.loadRecipes.and.returnValue(throwError('error'));
    cookbookEffects.loadSpecificRecipes$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.loadSpecificRecipesFailure.type);
    });
  });

  it('loadRecipes should return success action when triggered by loadCookbookSuccess', () => {
    cookbookEffects = createEffects(of({type: CookbookApiActions.loadCookbookSuccess.type}));
    recipeService.loadRecipes.and.returnValue(of([{cookbookId: 'cookBookId'}] as Recipe[]));
    cookbookEffects.loadRecipes$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.loadRecipesSuccess.type);
    });
  });

  it('loadRecipes should return failure action when triggered by loadCookbookSuccess', () => {
    cookbookEffects = createEffects(of({type: CookbookApiActions.loadCookbookSuccess.type}));
    recipeService.loadRecipes.and.returnValue(throwError('error'));
    cookbookEffects.loadRecipes$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.loadRecipesFailure.type);
    });
  });

  it('saveRecipe should return success action', () => {
    cookbookEffects = createEffects(of({type: RecipeContainerActions.createRecipe.type}));
    recipeService.saveRecipe.and.returnValue(of({cookbookId: 'cookbookId'} as Recipe));
    cookbookEffects.saveRecipe$.subscribe((action: Action) => {
      expect(action.type).toEqual(RecipeApiActions.createRecipeSuccess.type);
    });
  });

  it('saveRecipe should return failure action', () => {
    cookbookEffects = createEffects(of({type: RecipeContainerActions.createRecipe.type}));
    recipeService.saveRecipe.and.returnValue(throwError('error'));
    cookbookEffects.saveRecipe$.subscribe((action: Action) => {
      expect(action.type).toEqual(RecipeApiActions.createRecipeFailure.type);
    });
  });

  it('editRecipe should return success action', () => {
    cookbookEffects = createEffects(of({type: RecipeContainerActions.editRecipe.type}));
    recipeService.editRecipe.and.returnValue(of({cookbookId: 'cookbookId'} as Recipe));
    cookbookEffects.editRecipe$.subscribe((action: Action) => {
      expect(action.type).toEqual(RecipeApiActions.editRecipeSuccess.type);
    });
  });

  it('editRecipe should return failure action', () => {
    cookbookEffects = createEffects(of({type: RecipeContainerActions.editRecipe.type}));
    recipeService.editRecipe.and.returnValue(throwError('error'));
    cookbookEffects.editRecipe$.subscribe((action: Action) => {
      expect(action.type).toEqual(RecipeApiActions.editRecipeFailure.type);
    });
  });

  it('deleteRecipe should return success action', () => {
    cookbookEffects = createEffects(of({type: CookbookContainerActions.deleteRecipe.type, recipe: recipeA as Recipe}));
    recipeService.deleteRecipe.and.returnValue(of(true));
    cookbookEffects.deleteRecipe$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.deleteRecipeSuccess.type);
    });
  });

  it('deleteRecipe should return failure action', () => {
    cookbookEffects = createEffects(of({type: CookbookContainerActions.deleteRecipe.type, recipe: recipeA as Recipe}));
    recipeService.deleteRecipe.and.returnValue(throwError('error'));
    cookbookEffects.deleteRecipe$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.undoDeleteRecipeFromState.type);
    });
  });

  it('should navigate to cookbook on createRecipeSuccess', () => {
    cookbookEffects = createEffects(of({type: RecipeApiActions.createRecipeSuccess.type, recipe: {cookbookId: 'cookbookId'} as Recipe}));
    cookbookEffects.navigateToCookbook$.subscribe(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/cookbook'], {queryParams: {selectedCookbookId: 'cookbookId'}});
    });
  });

  it('should navigate to cookbook on editRecipeSuccess', () => {
    cookbookEffects = createEffects(of({type: RecipeApiActions.editRecipeSuccess.type, recipe: {cookbookId: 'cookbookId'} as Recipe}));
    cookbookEffects.navigateToCookbook$.subscribe(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/cookbook'], {queryParams: {selectedCookbookId: 'cookbookId'}});
    });
  });

  it('createCookbook should return success action', () => {
    cookbookEffects = createEffects(of({type: CookbookContainerActions.createCookbook.type, title: cookbook.title}));
    cookbookService.saveCookbook.and.returnValue(of(cookbook));
    cookbookEffects.createCookbook$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.createCookbookSuccess.type);
    });
  });

  it('createCookbook should return failure action', () => {
    cookbookEffects = createEffects(of({type: CookbookContainerActions.createCookbook.type, title: cookbook.title}));
    cookbookService.saveCookbook.and.returnValue(throwError('error'));
    cookbookEffects.createCookbook$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.createCookbookFailure.type);
    });
  });

  it('editCookbook should return success action', () => {
    cookbookEffects = createEffects(of({type: CookbookContainerActions.editCookbook.type, cookbook}));
    cookbookService.editCookbook.and.returnValue(of(cookbook));
    cookbookEffects.editCookbook$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.editCookbookSuccess.type);
    });
  });

  it('editCookbook should return failure action', () => {
    cookbookEffects = createEffects(of({type: CookbookContainerActions.editCookbook.type, cookbook}));
    cookbookService.editCookbook.and.returnValue(throwError('error'));
    cookbookEffects.editCookbook$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.editCookbookFailure.type);
    });
  });

  it('deleteCookbook should return success action', () => {
    cookbookEffects = createEffects(of({type: CookbookContainerActions.deleteCookbook.type, cookbook}));
    cookbookService.deleteCookbook.and.returnValue(of(true));
    cookbookEffects.deleteCookbook$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.deleteCookbookSuccess.type);
    });
  });

  it('deleteCookbook should return undoDeleteFromState action', () => {
    cookbookEffects = createEffects(of({type: CookbookContainerActions.deleteCookbook.type, cookbook}));
    cookbookService.deleteCookbook.and.returnValue(throwError('error'));
    cookbookEffects.deleteCookbook$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.undoDeleteCookbookFromState.type);
    });
  });

  it(`chooseActiveCookbookId should dispatch ${CookbookApiActions.setActiveCookbookIdAsQueryParam} with requestedId`, () => {
    cookbookEffects = createEffects(of({type: CookbookApiActions.loadCookbookSuccess.type, cookbooks: [cookbook]}));
    cookbookEffects.chooseActiveCookbookId$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.setActiveCookbookIdAsQueryParam.type);
      expect((action as SetActiveCookbookIdAsQueryParamAction).selectedCookbookId).toEqual(cookbook.id);
    });
  });

  it(`chooseActiveCookbookId should dispatch ${CookbookApiActions.setActiveCookbookIdAsQueryParam} with availableId`, () => {
    activatedRoute = {
      snapshot: {
        queryParams: {
          selectedCookbookId: 'differentId'
        } as Params
      }
    } as ActivatedRoute;
    cookbookEffects = createEffects(of({type: CookbookApiActions.loadCookbookSuccess.type, cookbooks: [cookbook]}));
    cookbookEffects.chooseActiveCookbookId$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.setActiveCookbookIdAsQueryParam.type);
      expect((action as SetActiveCookbookIdAsQueryParamAction).selectedCookbookId).toEqual(cookbook.id);
    });
  });

  it(`setQueryParameterForActiveShoppingList should set
   queryParam when CookbookApiActions.setActiveCookbookIdAsQueryParam is dispatched`, () => {
    cookbookEffects = createEffects(of({type: CookbookApiActions.setActiveCookbookIdAsQueryParam.type, selectedCookbookId: cookbook.id}));
    cookbookEffects.setQueryParameterForActiveShoppingList$.subscribe(() => {
      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: activatedRoute as ActivatedRoute,
        queryParams: {selectedCookbookId: cookbook.id}
      });
    });
  });

  it(`setQueryParameterForActiveShoppingList should set
   queryParam when CookbookContainerActions.selectCookbook is dispatched`, () => {
    cookbookEffects = createEffects(of({type: CookbookContainerActions.selectCookbook.type, selectedCookbookId: cookbook.id}));
    cookbookEffects.setQueryParameterForActiveShoppingList$.subscribe(() => {
      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: activatedRoute as ActivatedRoute,
        queryParams: {selectedCookbookId: cookbook.id}
      });
    });
  });

  it('switchCookbookWhenDeleted should switch when current List is deleted', () => {
    store.setState({cookbookState: {activeCookbookId: cookbook.id, cookbooks: [{id: '1', title: 'test'}]}});
    cookbookEffects = createEffects(of({type: CookbookContainerActions.deleteCookbookFromState.type, cookbook}));
    cookbookEffects.switchCookbookWhenDeleted$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookContainerActions.selectCookbook.type);
      expect((action as CookbookSelectedAction).selectedCookbookId).toEqual('1');
    });
  });

});


function createEffects(actions$: Observable<Action>): CookbookEffects {
  return new CookbookEffects(
    actions$,
    cookbookService,
    store as Store<GlobalState>,
    recipeService,
    router,
    activatedRoute as ActivatedRoute,
    storageService
  );
}
