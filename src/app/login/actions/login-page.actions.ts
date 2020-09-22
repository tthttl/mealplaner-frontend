import { createAction, props } from '@ngrx/store';
import { I18n, LoginCredentials } from '../../shared/model/model';

export const login = createAction(
  '[Login Page] Login',
  props<{ credentials: LoginCredentials }>());
