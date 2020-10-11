import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { convertRecipeApiToRecipe, convertRecipesApiToRecipes } from '../../shared/helpers/helpers';
import { Recipe } from '../../shared/model/model';
import { IngredientApi, RecipeApi } from '../../shared/model/model-api';
import { RecipeService } from './recipe.service';

describe(`${RecipeService}`, () => {

  let injector: TestBed;
  let recipeService: RecipeService;
  let httpClientMock: HttpTestingController;

  const ingredient: IngredientApi = {
    id: '1',
    title: 'ingredient',
    unit: 'tableSpoon',
    amount: 1,
    isStapleFood: false
  };
  const recipeApiA: RecipeApi = {
    id: 'A',
    title: 'recipeA',
    ingredients: [ingredient]
  };
  const cookbookId = 'cookbookId';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecipeService]
    });
    injector = getTestBed();
    recipeService = injector.inject(RecipeService);
    httpClientMock = injector.inject(HttpTestingController);
  });

  it('loadRecipes should load Recipes', () => {
    recipeService.loadRecipes(cookbookId)
      .subscribe((recipes: Recipe[]) => {
        expect(recipes).toEqual(convertRecipesApiToRecipes([recipeApiA]));
      });

    const request = httpClientMock.expectOne(`${environment.apiUrl}/recipes?cookbook=${cookbookId}`);
    expect(request.request.method).toEqual('GET');
    request.flush([recipeApiA]);
  });

  it('saveRecipes should save Recipes', () => {
    recipeService.saveRecipe(cookbookId, convertRecipeApiToRecipe(recipeApiA))
      .subscribe((recipe: Recipe) => {
        expect(recipe).toEqual(convertRecipeApiToRecipe(recipeApiA));
      });

    const request = httpClientMock.expectOne(`${environment.apiUrl}/recipes`);
    expect(request.request.method).toEqual('POST');
    request.flush(recipeApiA);
  });

  it('editRecipe should edit Recipes', () => {
    recipeService.editRecipe(cookbookId, convertRecipeApiToRecipe(recipeApiA))
      .subscribe((recipe: Recipe) => {
        expect(recipe).toEqual(convertRecipeApiToRecipe(recipeApiA));
      });

    const request = httpClientMock.expectOne(`${environment.apiUrl}/recipes/${recipeApiA.id}`);
    expect(request.request.method).toEqual('PUT');
    request.flush(recipeApiA);
  });

  it('deleteRecipe should edit Recipes', () => {
    recipeService.deleteRecipe(recipeApiA.id)
      .subscribe((result: string) => {
        expect(result).toEqual('DELETE');
      });

    const request = httpClientMock.expectOne(`${environment.apiUrl}/recipes/${recipeApiA.id}`);
    expect(request.request.method).toEqual('DELETE');
    request.flush('DELETE');
  });

});
