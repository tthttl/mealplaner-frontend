import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { convertCookbookApisToCookbooks } from '../../shared/helpers/helpers';
import { Cookbook } from '../../shared/model/model';
import { CookbookApi } from '../../shared/model/model-api';
import { CookbookService } from './cookbook.service';
import { RecipeService } from './recipe.service';

describe(`${RecipeService}`, () => {

  let injector: TestBed;
  let cookbookService: CookbookService;
  let httpClientMock: HttpTestingController;

  const userId = 'userId';

  const cookbook: CookbookApi = {
    id: '1',
    title: 'cookbook'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CookbookService]
    });
    injector = getTestBed();
    cookbookService = injector.inject(CookbookService);
    httpClientMock = injector.inject(HttpTestingController);
  });

  it('loadCookbooks should load Cookbooks', () => {
    cookbookService.loadCookbooks(userId)
      .subscribe((cookbooks: Cookbook[]) => {
        expect(cookbooks).toEqual(convertCookbookApisToCookbooks([cookbook]));
      });

    const request = httpClientMock.expectOne(`${environment.apiUrl}/cookbooks?user=${userId}&_sort=title:asc`);
    expect(request.request.method).toEqual('GET');
    request.flush([cookbook]);
  });

});
