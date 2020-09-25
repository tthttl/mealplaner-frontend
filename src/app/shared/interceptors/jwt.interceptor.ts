import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { GlobalState, selectUser } from '../state';
import { Observable } from 'rxjs';
import { flatMap, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private store: Store<GlobalState>) {
  }

  intercept(request: HttpRequest<{}>, next: HttpHandler): Observable<HttpEvent<{}>> {

    return this.store.select(selectUser).pipe(
      take(1),
      flatMap(user => {
        const jwt = user?.jwt || null;
        const isRequestToAppBackend = request.url.startsWith(environment.authUrl);
        const authReq = !!(jwt && isRequestToAppBackend) ? request.clone({
          setHeaders: {Authorization: 'Bearer ' + jwt},
        }) : request;

        return next.handle(authReq);
      })
    );
  }
}

