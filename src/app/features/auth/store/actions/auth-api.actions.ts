import { createAction, props } from '@ngrx/store';
import { User } from '../../../../core/models/model';

export const loginSuccess = createAction('[Auth API] Login Success', props<{ user: User }>());
export const loginFailure = createAction('[Auth] Login Failure',  props<{ error: string }>());

export const refreshTokenSuccess = createAction('[Auth API] Refresh Token Success', props<{ user: User }>());
export const refreshTokenFailed = createAction('[Auth App] Refresh Token Failed');

export const logoutSuccess = createAction('[Auth API] Logout Success');
export const logoutFailure = createAction('[Auth API] Logout Failure');

export const registerSuccess = createAction('[Auth API] Register Success', props<{ user: User }>());
export const registerFailure = createAction('[Auth API] Register Failure', props<{ error: string }>());

export const forgotPasswordSuccess = createAction('[Auth API] Forgot Password Success');
export const forgotPasswordFailure = createAction('[Auth API] Forgot Password Failure');

export const restPasswordSuccess = createAction('[Auth API] Rest Password Success', props<{ user: User }>());
export const restPasswordFailure = createAction('[Auth API] Rest Password Failure', props<{ error: string }>());

export const deleteAccountSuccess = createAction('[Auth API] Delete Account Success', props<{}>());
export const deleteAccountFailure = createAction('[Auth API] Delete Account Failure', props<{ user: User }>());
