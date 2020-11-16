import { createAction, props } from '@ngrx/store';

export const requestEmail = createAction(
  '[Forgot Password Container] Request Reset Email',
  props<{ email: string }>());
