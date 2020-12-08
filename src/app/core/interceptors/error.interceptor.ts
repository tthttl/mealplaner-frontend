import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, flatMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../../features/auth/services/auth.service';
import { GlobalState, selectUser } from '../store';
import { ErrorInterceptorActions } from '../store/actions';

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
            return throwError(err);
          })
        );
      }));
  }
}
