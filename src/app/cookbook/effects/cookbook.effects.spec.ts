import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { Cookbook, Recipe } from '../../shared/model/model';
import { CookbookSelectedAction, SetActiveCookbookIdAsQueryParamAction } from '../../shared/model/model-action';
import { GlobalState, initialState } from '../../shared/state';
import { CookbookApiActions, CookbookContainerActions } from '../actions';
import { CookbookService } from '../services/cookbook.service';
import { RecipeService } from '../services/recipe.service';
import { CookbookEffects } from './cookbook.effects';
import SpyObj = jasmine.SpyObj;

let cookbookService: SpyObj<CookbookService>;
let router: SpyObj<Router>;
let store: MockStore;
let recipeService: SpyObj<RecipeService>;
let activatedRoute: Partial<ActivatedRoute>;

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
    router = jasmine.createSpyObj('Router', ['navigate']);
    recipeService = jasmine.createSpyObj('RecipeService', ['loadRecipes', 'saveRecipe', 'editRecipe', 'deleteRecipe']);
    cookbookService = jasmine.createSpyObj('CookbookService', ['loadCookbooks', 'saveCookbook', 'editCookbook', 'deleteCookbook']);
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
    cookbookEffects = createEffects(of({type: CookbookContainerActions.createRecipe.type}));
    recipeService.saveRecipe.and.returnValue(of({cookbookId: 'cookbookId'} as Recipe));
    cookbookEffects.saveRecipe$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.createRecipeSuccess.type);
    });
  });

  it('saveRecipe should return failure action', () => {
    cookbookEffects = createEffects(of({type: CookbookContainerActions.createRecipe.type}));
    recipeService.saveRecipe.and.returnValue(throwError('error'));
    cookbookEffects.saveRecipe$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.createRecipeFailure.type);
    });
  });

  it('editRecipe should return success action', () => {
    cookbookEffects = createEffects(of({type: CookbookContainerActions.editRecipe.type}));
    recipeService.editRecipe.and.returnValue(of({cookbookId: 'cookbookId'} as Recipe));
    cookbookEffects.editRecipe$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.editRecipeSuccess.type);
    });
  });

  it('editRecipe should return failure action', () => {
    cookbookEffects = createEffects(of({type: CookbookContainerActions.editRecipe.type}));
    recipeService.editRecipe.and.returnValue(throwError('error'));
    cookbookEffects.editRecipe$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.editRecipeFailure.type);
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
    cookbookEffects = createEffects(of({type: CookbookApiActions.createRecipeSuccess.type, recipe: {cookbookId: 'cookbookId'} as Recipe}));
    cookbookEffects.navigateToCookbook$.subscribe(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/cookbook'], {queryParams: {selectedCookbookId: 'cookbookId'}});
    });
  });

  it('should navigate to cookbook on editRecipeSuccess', () => {
    cookbookEffects = createEffects(of({type: CookbookApiActions.editRecipeSuccess.type, recipe: {cookbookId: 'cookbookId'} as Recipe}));
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
    cookbookEffects.setQueryParameterForActiveShoppingList$.subscribe((action: Action) => {
      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: activatedRoute as ActivatedRoute,
        queryParams: {selectedCookbookId: cookbook.id}
      });
    });
  });

  it(`setQueryParameterForActiveShoppingList should set
   queryParam when CookbookContainerActions.selectCookbook is dispatched`, () => {
    cookbookEffects = createEffects(of({type: CookbookContainerActions.selectCookbook.type, selectedCookbookId: cookbook.id}));
    cookbookEffects.setQueryParameterForActiveShoppingList$.subscribe((action: Action) => {
      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: activatedRoute as ActivatedRoute,
        queryParams: {selectedCookbookId: cookbook.id}
      });
    });
  });

  it('switchCookbookWhenDeleted should switch when current List is deleted', () => {
    store.setState({cookbookState: {activeCookbookId: cookbook.id}});
    cookbookEffects = createEffects(of({type: CookbookContainerActions.deleteCookbookFromState.type, cookbook}));
    cookbookEffects.switchCookbookWhenDeleted$.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookContainerActions.selectCookbook.type);
      expect((action as CookbookSelectedAction).selectedCookbookId).toEqual(cookbook.id);
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
    activatedRoute as ActivatedRoute
  );
}
