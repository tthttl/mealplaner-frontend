import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { GlobalState, selectUser } from '../state';
import { Observable } from 'rxjs';
import { first, flatMap, map, withLatestFrom } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private store: Store<GlobalState>) {
  }

  intercept(request: HttpRequest<{}>, next: HttpHandler): Observable<HttpEvent<{}>> {

    return this.store.select(selectUser).pipe(
      first(),
      flatMap(user => {
        const jwt = user?.jwt || null;
        const isRequestToAppBackend = request.url.startsWith(environment.apiUrl);
        const authReq = !!(jwt && isRequestToAppBackend) ? request.clone({
          setHeaders: { Authorization: 'Bearer ' + jwt },
        }) : request;

        return next.handle(authReq);
      })
    );
  }
}


/*
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select(fromAuth.getToken).pipe(
      first(),
      flatMap(token => {
        const authReq = !!token ? req.clone({
          setHeaders: { Authorization: 'Bearer ' + token },
        }) : req;
        return next.handle(authReq);
      }),
    );
  }
}

 */
