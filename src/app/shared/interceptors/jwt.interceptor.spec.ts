import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { I18nService } from '../../i18n/services/i18n.service';
import { JwtInterceptor } from './jwt.interceptor';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../state';
import { of } from 'rxjs';

describe(`AuthHttpInterceptor`, () => {
  let service: I18nService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    class StoreMock {
      select = jasmine.createSpy().and.returnValue(of({...initialState}));
      dispatch = jasmine.createSpy();
      pipe = jasmine.createSpy().and.returnValue(of('success'));
    }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        I18nService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true,
        },
        {
          provide: Store,
          useClass: StoreMock
        },
        provideMockStore({initialState: {...initialState, appState: {user: {jwt: 'jwt'}}}})
      ],
    });

    service = TestBed.inject(I18nService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should add an Authorization header', () => {
    service.getI18n('de').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(`${environment.apiUrl}/i18n/de`);

    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
  });
});
