import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { GlobalState, isLoggedIn as selectIsLoggedIn } from '../store';
import { mergeMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CustomPreloadingStrategyService implements PreloadingStrategy {
  isLoggedIn$: Observable<boolean | null> = this.store.select(selectIsLoggedIn);

  constructor(private store: Store<GlobalState>, private router: Router) {
  }

  // tslint:disable-next-line:no-any
  preload(route: Route, fn: () => Observable<any>): Observable<any> {
    return this.isLoggedIn$.pipe(
      mergeMap((isLoggedIn) => {
        if (!isLoggedIn) {
          return of(null);
        }

        const requestedPage = this.router.url.split('/').pop()!.split('?')[0];

        return route.data?.usedBy?.includes(requestedPage) ? fn() : of(null);
      })
    );
  }
}
