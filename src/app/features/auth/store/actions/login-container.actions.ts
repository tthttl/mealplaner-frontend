import { createAction, props } from '@ngrx/store';
import { LoginCredentials } from '../../../../core/models/model';

export const login = createAction(
  '[Login Page] Login',
  props<{ credentials: LoginCredentials }>());
