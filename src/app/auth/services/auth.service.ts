import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { decodeJWT, mapI18nApiToI18nClient, mapUserApiToUserClient } from '../../shared/helpers/helpers';
import { UserApi, I18n as I18nApi } from '../../shared/model/model-api';
import { JwtToken, LoginCredentials, User } from '../../shared/model/model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private refreshTokenTimeout: number | undefined;

  constructor(private httpClient: HttpClient) {
  }

  login(credentials: LoginCredentials): Observable<User> {
    return this.httpClient.post<UserApi>(`${environment.apiUrl}/auth/local`, credentials).pipe(
      map((userApi: UserApi) => mapUserApiToUserClient(userApi)),
      tap(user => this.startRefreshTokenTimer(user.jwt))
    );
  }

  refreshToken(): Observable<User | null> {
    return this.httpClient.post<UserApi>(`${environment.apiUrl}/auth/refresh-token`, {}).pipe(
      map((response: UserApi | {ok: false, accessToken: ''}) => {
        return response.hasOwnProperty('jwt') ? mapUserApiToUserClient(response as UserApi) : null;
      }),
      tap(user => user && this.startRefreshTokenTimer(user.jwt))
    );
  }

  logout(): Observable<true> {
    this.stopRefreshTokenTimer();
    return this.httpClient.post<true>(`${environment.apiUrl}/auth/logout`, {});
  }

  private startRefreshTokenTimer(jwt: string): void {
    const {exp} = decodeJWT(jwt);

    const expires = new Date(exp * 1000);
    // set a timeout to refresh the token a minute before it expires
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.stopRefreshTokenTimer();
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout);
  }
}

