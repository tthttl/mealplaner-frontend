import { createAction, props } from '@ngrx/store';


export const setRequestedUrlBeforeLoginWasRequired = createAction(
  '[Auth Guard] Set Requested Url Before Login Was Required',
  props<{ url: string }>());


