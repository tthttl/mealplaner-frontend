import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/model/model';

export const loadShoppingListItems = createAction('[Shopping List Container] Load Shopping List Items', props<{ id: string }>());

