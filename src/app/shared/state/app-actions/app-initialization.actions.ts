import { createAction, props } from '@ngrx/store';
import { I18n, Language, User } from '../../model/model';


export const loadI18n = createAction(
  '[App Initialization] Load I18n',
  props<{ language: Language }>());

export const refreshToken = createAction('[App Initialization] Refresh JWT Token');

export const initialized = createAction('[App Initialization] App Initialized');

