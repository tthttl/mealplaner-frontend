import { createAction, props } from '@ngrx/store';
import { I18n, LoginCredentials } from '../../shared/model/model';

export const refreshToken = createAction('[Auth Service] Refresh Token');
