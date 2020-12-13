import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { decodeJwtToken, mapUserApiToUserClient } from '../../../core/helpers/helpers';
import { UserApi, UserDetailApi } from '../../../core/models/model-api';
import { JwtRefreshResponse, LoginCredentials, RegisterCredentials, User } from '../../../core/models/model';
import { GlobalState } from '../../../core/store';
import { Store } from '@ngrx/store';
import { LoginServiceActions } from '../store/actions';

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

  register(credentials: RegisterCredentials): Observable<User> {
    return this.httpClient.post<UserApi>(`${environment.authUrl}/auth/local/register`, {username: credentials.email, ...credentials}).pipe(
      map((userApi: UserApi) => mapUserApiToUserClient(userApi)),
      tap(user => this.startRefreshTokenTimer(user.jwt))
    );
  }

  deleteAccount(user: User): Observable<UserDetailApi> {
    return this.httpClient.delete<UserDetailApi>(`${environment.apiUrl}/users/${user.id}`).pipe(
      tap(() => this.stopRefreshTokenTimer())
    );
  }

  refreshToken(): Observable<JwtRefreshResponse> {
    return this.httpClient.post<JwtRefreshResponse>(`${environment.authUrl}/auth/refresh-token`, {}).pipe(
      tap((jwtRenewal: JwtRefreshResponse) => jwtRenewal.user && this.startRefreshTokenTimer(jwtRenewal.user.jwt))
    );
  }

  forgotPassword(email: string): Observable<{ ok: boolean }> {
    return this.httpClient.post<{ ok: boolean }>(`${environment.authUrl}/auth/forgot-password`, {email, user: email});
  }

  resetPassword(password: string, resetPasswordToken: string): Observable<User> {
    return this.httpClient.post<UserApi>(
      `${environment.authUrl}/auth/reset-password`,
      {code: resetPasswordToken, password, passwordConfirmation: password})
      .pipe(
        map((userApi: UserApi) => mapUserApiToUserClient(userApi)),
        tap(user => this.startRefreshTokenTimer(user.jwt))
      );
  }

  logout(): Observable<{ok: true}> {
    this.stopRefreshTokenTimer();
    return this.httpClient.post<{ok: true}>(`${environment.authUrl}/auth/logout`, {});
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

