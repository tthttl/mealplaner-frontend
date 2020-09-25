import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { I18nService } from './i18n.service';
import { I18n as I18nApi } from '../../shared/model/model-api';
import { environment } from '../../../environments/environment';
import { I18n as I18nClient } from '../../shared/model/model';
import { mapI18nApiToI18nClient } from '../../shared/helpers/helpers';


describe('StudentsService', () => {
  let injector: TestBed;
  let service: I18nService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [I18nService],
    });

    injector = getTestBed();
    service = injector.inject(I18nService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('getI18n() should return I18n', () => {
    const mockI18nApi: I18nApi = {
      lang: 'de',
      translations: {test: 'test'}
    };

    service.getI18n('de').subscribe((res) => {
      expect(res).toEqual(mapI18nApiToI18nClient(mockI18nApi));
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/i18n/de`);
    expect(req.request.method).toBe('GET');
    req.flush(mockI18nApi);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
