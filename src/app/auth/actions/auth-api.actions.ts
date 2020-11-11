import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/model/model';

export const loginSuccess = createAction('[Auth API] Login Success', props<{ user: User }>());
export const loginFailure = createAction('[Auth] Login Failure',  props<{ error: string }>());

export const refreshTokenSuccess = createAction('[Auth API] Refresh Token Success', props<{ user: User }>());
export const refreshTokenFailed = createAction('[Auth App] Refresh Token Failed');

export const logoutSuccess = createAction('[Auth API] Logout Success');
export const logoutFailure = createAction('[Auth API] Logout Failure');

export const registerSuccess = createAction('[Auth API] Register Success', props<{ user: User }>());
export const registerFailure = createAction('[Auth API] Register Failure', props<{ error: string }>());
