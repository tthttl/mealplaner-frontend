import { createAction, props } from '@ngrx/store';
import { RegisterCredentials } from '../../../../core/models/model';

export const register = createAction(
  '[Register Container] Register',
  props<{ credentials: RegisterCredentials }>());
