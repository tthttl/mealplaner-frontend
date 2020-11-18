import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalState, selectUser } from '../store';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { isJwtTokenExpired } from '../helpers/helpers';
import { DEFAULT_REDIRECT_URL_FOR_LOGGED_IN_USER } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class LoggedOutGuard implements CanActivate {
  constructor(private router: Router, private store: Store<GlobalState>) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    return this.store.select(selectUser).pipe(
      map(user => {
        if (!!user && !isJwtTokenExpired(user.jwt)) {
          this.router.navigate([DEFAULT_REDIRECT_URL_FOR_LOGGED_IN_USER]);
          return false;
        }

        return true;
      })
    );
  }
}


