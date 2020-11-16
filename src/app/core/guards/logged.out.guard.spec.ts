import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import SpyObj = jasmine.SpyObj;
import { GlobalState, initialState } from '../store';
import { LoggedOutGuard } from './logged-out.guard';
import { DEFAULT_REDIRECT_URL_FOR_LOGGED_IN_USER } from '../constants/constants';

const routeMock: Partial<ActivatedRouteSnapshot> = {url: []};
const routeStateMock: Partial<RouterStateSnapshot> = {url: '/cookies'};


describe('Logged Out Guard', () => {
  let authService: SpyObj<AuthService>;
  let router: SpyObj<Router>;
  let guard: LoggedOutGuard;
  // tslint:disable-next-line:no-any
  let store: any;

  const validJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTk5fQ.XXX'; // JWT Expires at November 16 5138
  const expiredJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjB9.XXX'; // JWT Expires at January 01 1970


  describe('', () => {
    beforeEach(() => {
      class StoreMock {
        select = jasmine.createSpy().and.returnValue(of({...initialState}));
        dispatch = jasmine.createSpy();
        pipe = jasmine.createSpy().and.returnValue(of('success'));
      }

      TestBed.configureTestingModule({
        providers: [
          {
            provide: Store,
            useClass: StoreMock
          },
          provideMockStore({initialState})
        ]
      });
      authService = jasmine.createSpyObj('AuthService', ['login']);
      router = jasmine.createSpyObj('Router', ['navigate']);
      store = TestBed.inject(Store);
      guard = new LoggedOutGuard(
        router,
        store);
    });

    it('should be created', () => {
      expect(guard).toBeTruthy();
    });

    it('should pass when no jwt token is available', (done) => {
      guard.canActivate(routeMock as ActivatedRouteSnapshot, routeStateMock as RouterStateSnapshot).subscribe((result: boolean) => {
        expect(result).toBeTrue();
        done();
      });
    });

    it('should fail when no jwt token is available and not expired', (done) => {
      store.setState({...initialState, appState: {user: {jwt: validJwt}}});
      guard.canActivate(routeMock as ActivatedRouteSnapshot, routeStateMock as RouterStateSnapshot).subscribe((result: boolean) => {
        expect(result).toBeFalse();
        done();
      });
    });

    it('should pass when no jwt token is available but  expired', (done) => {
      store.setState({...initialState, appState: {user: {jwt: expiredJWT}}});
      guard.canActivate(routeMock as ActivatedRouteSnapshot, routeStateMock as RouterStateSnapshot).subscribe((result: boolean) => {
        expect(result).toBeTrue();
        done();
      });
    });

    it('should redirect when failed', (done) => {
      store.setState({...initialState, appState: {user: {jwt: validJwt}}});
      guard.canActivate(routeMock as ActivatedRouteSnapshot, routeStateMock as RouterStateSnapshot).subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith([DEFAULT_REDIRECT_URL_FOR_LOGGED_IN_USER]);
        done();
      });
    });

    it('should not redirect when pass', (done) => {
      store.setState({...initialState, appState: {user: {jwt: expiredJWT}}} as GlobalState);
      guard.canActivate(routeMock as ActivatedRouteSnapshot, routeStateMock as RouterStateSnapshot).subscribe(() => {
        expect(router.navigate).toHaveBeenCalledTimes(0);
        done();
      });
    });
  });
});
