import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { Recipe, RecipeIngredient } from '../../../core/models/model';
import { RecipeService } from './recipe.service';

describe(`${RecipeService}`, () => {

  let injector: TestBed;
  let recipeService: RecipeService;
  let httpClientMock: HttpTestingController;

  const ingredient: RecipeIngredient = {
    id: '1',
    title: 'ingredient',
    unit: 'tableSpoon',
    amount: 1,
    isStapleFood: false
  };
  const recipeApiA: Recipe = {
    id: 'A',
    title: 'recipeA',
    cookbookId: 'cookbookId',
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
        expect(recipes).toEqual([recipeApiA]);
      });

    const request = httpClientMock.expectOne(`${environment.apiUrl}/recipes?cookbook=${cookbookId}&_sort=title:asc`);
    expect(request.request.method).toEqual('GET');
    request.flush([recipeApiA]);
  });

  it('saveRecipes should save Recipes', () => {
    recipeService.saveRecipe(cookbookId, recipeApiA)
      .subscribe((recipe: Recipe) => {
        expect(recipe).toEqual(recipeApiA);
      });

    const request = httpClientMock.expectOne(`${environment.apiUrl}/recipes`);
    expect(request.request.method).toEqual('POST');
    request.flush(recipeApiA);
  });

  it('editRecipe should edit Recipes', () => {
    recipeService.editRecipe(cookbookId, recipeApiA)
      .subscribe((recipe: Recipe) => {
        expect(recipe).toEqual(recipeApiA);
      });

    const request = httpClientMock.expectOne(`${environment.apiUrl}/recipes/${recipeApiA.id}`);
    expect(request.request.method).toEqual('PUT');
    request.flush(recipeApiA);
  });

  it('deleteRecipe should delete Recipes', () => {
    recipeService.deleteRecipe('A')
      .subscribe((result: boolean) => {
        expect(result).toEqual(true);
      });

    const request = httpClientMock.expectOne(`${environment.apiUrl}/recipes/${recipeApiA.id}`);
    expect(request.request.method).toEqual('DELETE');
    request.flush({DELETED: true});
  });

});
