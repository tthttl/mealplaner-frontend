import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isJwtTokenExpired } from '../helpers/helpers';
import { GlobalState, selectUser } from '../store';
import { AuthenticatedGuardActions } from '../store/actions';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {
  constructor(private router: Router, private store: Store<GlobalState>) {
  }

  canActivate(next: ActivatedRouteSnapshot, {url}: RouterStateSnapshot): Observable<boolean> {

    return this.store.select(selectUser).pipe(
      map(user => {

        if ((!user?.jwt || isJwtTokenExpired(user.jwt)) && navigator.onLine) {
          if (url !== 'auth/login' && url !== 'auth/register') {
            this.store.dispatch(AuthenticatedGuardActions.setRequestedUrlBeforeLoginWasRequired({url}));
          }
          this.router.navigate(['/auth/login']);
          return false;
        }

        return true;
      })
    );
  }
}


