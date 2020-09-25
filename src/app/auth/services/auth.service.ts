import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { decodeJwtToken, mapUserApiToUserClient } from '../../shared/helpers/helpers';
import { UserApi } from '../../shared/model/model-api';
import { JwtRefreshResponse, LoginCredentials, User } from '../../shared/model/model';
import { GlobalState } from '../../shared/state';
import { Store } from '@ngrx/store';
import { LoginServiceActions } from '../actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private refreshTokenTimeout: number | undefined;

  constructor(private httpClient: HttpClient, private store: Store<GlobalState>) {
  }

  login(credentials: LoginCredentials): Observable<User> {
    return this.httpClient.post<UserApi>(`${environment.authUrl}/auth/local`, credentials).pipe(
      map((userApi: UserApi) => mapUserApiToUserClient(userApi)),
      tap(user => this.startRefreshTokenTimer(user.jwt))
    );
  }

  refreshToken(): Observable<JwtRefreshResponse> {
    return this.httpClient.post<JwtRefreshResponse>(`${environment.authUrl}/auth/refresh-token`, {}).pipe(
      tap((jwtRenewal: JwtRefreshResponse) => jwtRenewal.user && this.startRefreshTokenTimer(jwtRenewal.user.jwt))
    );
  }

  logout(): Observable<true> {
    this.stopRefreshTokenTimer();
    return this.httpClient.post<true>(`${environment.authUrl}/auth/logout`, {});
  }

  private startRefreshTokenTimer(jwt: string): void {
    const {exp} = decodeJwtToken(jwt);

    const expires = new Date(exp * 1000);
    // set a timeout to refresh the token a minute before it expires
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.stopRefreshTokenTimer();
    this.refreshTokenTimeout = window.setTimeout(() => this.store.dispatch(LoginServiceActions.refreshToken()), timeout);
  }

  private stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout);
  }
}

