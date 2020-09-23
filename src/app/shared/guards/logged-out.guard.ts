import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalState, selectTranslations, selectUser } from '../state';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { isTokenExpired } from '../helpers/helpers';

@Injectable({
  providedIn: 'root'
})
export class LoggedOutGuard implements CanActivate {
  constructor(private router: Router, private store: Store<GlobalState>) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.store.select(selectUser).pipe(
      map(user => {
        if (!!user && isTokenExpired(user.jwt)) {
          this.router.navigate(['/shopping-list']);
          return false;
        }

        return true;
      })
    );
  }
}


