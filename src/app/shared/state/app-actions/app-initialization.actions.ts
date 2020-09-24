import { createAction, props } from '@ngrx/store';
import { Language } from '../../model/model';


export const setLanguage = createAction(
  '[App Initialization] Set Application Startup Language',
  props<{ language: Language }>());

export const refreshToken = createAction('[App Initialization] Refresh JWT Token');

export const initialized = createAction('[App Initialization] App Initialized');

