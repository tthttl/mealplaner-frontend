import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { convertCookbookApisToCookbooks } from '../../shared/helpers/helpers';
import { Cookbook } from '../../shared/model/model';
import { CookbookApi } from '../../shared/model/model-api';
import { CookbookService } from './cookbook.service';

describe(`${CookbookService}`, () => {

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

  it('saveCookbook should save Cookbook', () => {
    cookbookService.saveCookbook(cookbook.title)
      .subscribe((result: Cookbook) => {
        expect(result).toEqual(cookbook);
      });

    const request = httpClientMock.expectOne(`${environment.apiUrl}/cookbooks`);
    expect(request.request.method).toEqual('POST');
    expect(request.request.body).toEqual({title: cookbook.title});
    request.flush(cookbook);
  });

  it('editCookbook should edit Cookbook', () => {
    cookbookService.editCookbook(cookbook)
      .subscribe((result: Cookbook) => {
        expect(result).toEqual(cookbook);
      });

    const request = httpClientMock.expectOne(`${environment.apiUrl}/cookbooks/${cookbook.id}`);
    expect(request.request.method).toEqual('PUT');
    expect(request.request.body).toEqual(cookbook);
    request.flush(cookbook);
  });

  it('deleteCookbook should delete Cookbook', () => {
    cookbookService.deleteCookbook(cookbook.id)
      .subscribe((deleted: boolean) => {
        expect(deleted).toEqual(true);
      });

    const request = httpClientMock.expectOne(`${environment.apiUrl}/cookbooks/${cookbook.id}`);
    expect(request.request.method).toEqual('DELETE');
    request.flush({DELETED: true});
  });

});
