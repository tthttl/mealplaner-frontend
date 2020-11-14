import { createAction, props } from '@ngrx/store';
import { LoginCredentials, RegisterCredentials } from '../../shared/model/model';

export const resetPassword = createAction(
  '[Reset Password Container] Reset Password',
  props<{ password: string, resetPasswordToken: string }>());
