import { createAction, props } from '@ngrx/store';

export const resetPassword = createAction(
  '[Reset Password Container] Reset Password',
  props<{ password: string, resetPasswordToken: string }>());
