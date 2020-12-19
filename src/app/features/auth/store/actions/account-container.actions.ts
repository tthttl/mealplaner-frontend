import { createAction, props } from '@ngrx/store';
import { User } from '../../../../core/models/model';

export const deleteAccount = createAction(
  '[Account Container] Delete Account',
  props<{ user: User }>());
