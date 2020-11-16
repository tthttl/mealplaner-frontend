import { createAction, props } from '@ngrx/store';
import { Language } from '../../models/model';


export const changeLanguage = createAction('[AppComponent] Change Language', props<{ language: Language }>());
export const logout = createAction('[Nav] Logout');
