import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { JwtRefreshResponse, User as UserClient } from '../../shared/model/model';
import { UserApi } from '../../shared/model/model-api';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { initialState } from '../../shared/state';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { mapUserApiToUserClient } from '../../shared/helpers/helpers';


describe('AuthService', () => {
  let injector: TestBed;
  let service: AuthService;
  let httpMock: HttpTestingController;
  class StoreMock {
    select = jasmine.createSpy().and.returnValue(of({...initialState}));
    dispatch = jasmine.createSpy();
    pipe = jasmine.createSpy().and.returnValue(of('success'));
  }

  const validJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTk5fQ.XXX'; // JWT Expires at November 16 5138

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService,
        {
          provide: Store,
          useClass: StoreMock
        },
        provideMockStore({})
      ],
    });

    injector = getTestBed();
    service = injector.inject(AuthService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('login() should return User', () => {
    const mockUserApi: UserApi = {
      user: {
        _id: '0',
        username: 'Joe',
        email: 'joe@doe.com',
      },
      jwt: validJwt
    };

    service.login({identifier: 'joe@doe.com', password: 'jane'}).subscribe((res) => {
      expect(res).toEqual(mapUserApiToUserClient(mockUserApi));
    });

    const req = httpMock.expectOne(`${environment.authUrl}/auth/local`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUserApi);
  });

  it('refreshToken() should return RefreshToken', () => {
    const mockJwtRenewal: JwtRefreshResponse = {
      ok: true,
      user: {
        id: '0',
        name: 'Joe',
        email: 'joe@doe.com',
        jwt: validJwt
      }
    };

    service.refreshToken().subscribe((res) => {
      expect(res).toEqual(mockJwtRenewal);
    });

    const req = httpMock.expectOne(`${environment.authUrl}/auth/refresh-token`);
    expect(req.request.method).toBe('POST');
    req.flush(mockJwtRenewal);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
