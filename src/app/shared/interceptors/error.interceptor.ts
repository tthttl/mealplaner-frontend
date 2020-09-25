import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, flatMap, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { GlobalState, selectUser } from '../state';
import { AuthService } from '../../auth/services/auth.service';
import { ErrorInterceptorActions } from '../state/app-actions';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService, private store: Store<GlobalState>) {
  }

  intercept(request: HttpRequest<{}>, next: HttpHandler): Observable<HttpEvent<{}>> {

    return next.handle(request).pipe(
      catchError(err => {

        return this.store.select(selectUser).pipe(
          take(1),
          tap(user => {
            if ([401, 403].includes(err.status) && user && !request.url.includes('logout')) {
              this.store.dispatch(ErrorInterceptorActions.logout());
            }
          }),
          tap(_ => console.error(err)),
          flatMap(_ => {
            return throwError((err && err.error && err.error.message) || err.statusText);
          })
        );
      }));
  }
}
