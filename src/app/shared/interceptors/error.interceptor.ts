import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, first, flatMap, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { GlobalState, selectUser } from '../state';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService, private store: Store<GlobalState>) { }

  intercept(request: HttpRequest<{}>, next: HttpHandler): Observable<HttpEvent<{}>> {

    return next.handle(request).pipe(
      catchError(err => {

        return this.store.select(selectUser).pipe(
          first(),
          tap(user => {
            if ([401, 403].includes(err.status) && user) {
              console.log('here');
              this.authenticationService.logout().subscribe();
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
