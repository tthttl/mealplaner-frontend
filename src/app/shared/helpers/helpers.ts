import { FormControl } from '@angular/forms';
import { TranslatePipe } from '../../i18n/pipes/translate.pipe';
import { I18n, I18n as I18nClient, JwtToken, Language, User } from '../../shared/model/model';
import { I18n as I18nApi, UserApi } from '../../shared/model/model-api';
import { isAfter } from 'date-fns';

export function mapI18nApiToI18nClient(i18nApi: I18nApi): I18nClient {
  return {
    [i18nApi.lang]: i18nApi.translations
  };
}

export function mapUserApiToUserClient(userApi: UserApi): User {
  return {
    jwt: userApi.jwt,
    name: userApi.user.username,
    email: userApi.user.email,
  };
}

export function decodeJWT(token: string): JwtToken {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map((c: string) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export function translateValidationErrors(formControl: FormControl,
                                          translatePipe: TranslatePipe,
                                          translations: I18n | null,
                                          language: Language,
                                          key: string): string[] {
  if (formControl.invalid && formControl.errors && formControl.touched) {
    return Object.keys(formControl.errors).map(error => translatePipe
      .transform(`errors.validation.${error}`, translations || {}, language));
  }
  return [];
}

export function extractTokenExpirationDate(token: string): Date | null {
  const decoded: JwtToken = decodeJWT(token);
  return new Date(decoded.exp * 1000);
}

export function isTokenExpired(token: string, now: Date = new Date()): boolean {
  const tokenExpireationDate: Date | null = extractTokenExpirationDate(token);
  console.log('expDate', tokenExpireationDate);

  if (!tokenExpireationDate) {
    return true;
  }

  return isAfter(now, tokenExpireationDate);
}

