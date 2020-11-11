import { createAction, props } from '@ngrx/store';
import { RegisterCredentials } from '../../shared/model/model';

export const register = createAction(
  '[Register Container] Register',
  props<{ credentials: RegisterCredentials }>());
