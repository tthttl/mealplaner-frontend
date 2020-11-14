import { createAction, props } from '@ngrx/store';
import { LoginCredentials, RegisterCredentials } from '../../shared/model/model';

export const requestEmail = createAction(
  '[Forgot Password Container] Request Reset Email',
  props<{ email: string }>());
