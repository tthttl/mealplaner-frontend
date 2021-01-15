import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { mapUserApiToUserClient } from '../../../core/helpers/helpers';
import { JwtRefreshResponse, User } from '../../../core/models/model';
import { UserApi, UserDetailApi } from '../../../core/models/model-api';
import { initialState } from '../../../core/store';
import { AuthService } from './auth.service';


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
        username: 'joe@doe.com',
        email: 'joe@doe.com',
        name: 'Joe'
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

  it('register() should return User', () => {
    const mockUserApi: UserApi = {
      user: {
        _id: '0',
        username: 'joe@doe.com',
        email: 'joe@doe.com',
        name: 'Joe'
      },
      jwt: validJwt
    };

    service.register({name: 'Joe', email: 'joe@doe.com', invitationCode: 'CODE', password: 'jane'}).subscribe((res) => {
      expect(res).toEqual(mapUserApiToUserClient(mockUserApi));
    });

    const req = httpMock.expectOne(`${environment.authUrl}/auth/local/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUserApi);
  });

  it('forgotPassword() should return return success message', () => {
    service.forgotPassword('joe@doe.com').subscribe((res) => {
      expect(res).toEqual({ok: true});
    });

    const req = httpMock.expectOne(`${environment.authUrl}/auth/forgot-password`);
    expect(req.request.method).toBe('POST');
    req.flush({ok: true});
  });

  it('resetPassword() should return user', () => {
    const mockUserApi: UserApi = {
      user: {
        _id: '0',
        username: 'joe@doe.com',
        email: 'joe@doe.com',
        name: 'Joe'
      },
      jwt: validJwt
    };

    service.resetPassword('secret', 'resetToken').subscribe((res) => {
      expect(res).toEqual(mapUserApiToUserClient(mockUserApi));
    });

    const req = httpMock.expectOne(`${environment.authUrl}/auth/reset-password`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUserApi);
  });

  it('deleteAccount() should delete user', () => {
    const mockUserApi: UserDetailApi = {
      _id: '0',
      username: 'joe@doe.com',
      email: 'joe@doe.com',
      name: 'Joe'
    };

    service.deleteAccount({id: 'id'} as User).subscribe((res) => {
      expect(res).toEqual(mockUserApi);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/id`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockUserApi);
  });

  it('refreshToken() should return refresh token', () => {
    const mockJwtRenewal: JwtRefreshResponse = {
      ok: true,
      user: {
        id: '0',
        email: 'joe@doe.com',
        name: 'Joe',
        jwt: validJwt
      }
    };

    service.refreshToken().subscribe((res) => {
      expect(res).toEqual(mockJwtRenewal);
    });

    const req = httpMock.expectOne(`${environment.authUrl}/auth/refresh-token`);
    expect(req.request.method).toBe('GET');
    req.flush(mockJwtRenewal);
  });

  it('logout() should return true', () => {

    service.logout().subscribe((res) => {
      expect(res).toEqual({ok: true});
    });

    const req = httpMock.expectOne(`${environment.authUrl}/auth/logout`);
    expect(req.request.method).toBe('POST');
    req.flush({ok: true});
  });

  afterEach(() => {
    httpMock.verify();
  });
});
