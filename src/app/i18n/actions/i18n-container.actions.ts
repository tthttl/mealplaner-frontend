import { createAction, props } from '@ngrx/store';
import { Language } from '../../shared/model/model';

export const changeLanguage = createAction('[AppComponent] Change Language', props<{ language: Language }>());
