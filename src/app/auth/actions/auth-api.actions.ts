import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/model/model';

export const loginSuccess = createAction(
  '[Auth App] Login Success',
  props<{ user: User }>());

export const loginFailure = createAction('[Auth] Login Failure');

export const refreshTokenSuccess = createAction(
  '[Auth App] Refresh Token Success',
  props<{ user: User | null}>()
);

export const refreshTokenFailed = createAction(
  '[Auth App] Refresh Token Failed',
);

