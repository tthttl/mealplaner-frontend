import { createAction, props } from '@ngrx/store';
import { Language } from '../../models/model';


export const changeLanguage = createAction('[Navigation Actions] Change Language', props<{ language: Language }>());
export const logout = createAction('[Navigation Action] Logout');
