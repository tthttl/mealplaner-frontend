import { createAction, props } from '@ngrx/store';
import { User } from '../../../../core/models/model';


export const retryDeleteAccount = createAction('[Auth Effects] Retry Delete Account', props<{ user: User }>());
