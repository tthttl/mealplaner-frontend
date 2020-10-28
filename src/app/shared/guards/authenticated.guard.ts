import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalState, selectTranslations, selectUser } from '../state';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { isJwtTokenExpired } from '../helpers/helpers';
import { AuthenticatedGuardActions } from '../state/app-actions';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {
  constructor(private router: Router, private store: Store<GlobalState>) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    {url}: RouterStateSnapshot): Observable<boolean> {

    return this.store.select(selectUser).pipe(
      map(user => {

        if (!user?.jwt || isJwtTokenExpired(user.jwt)) {
          if (url !== 'auth/login') {
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


