import { createAction, props } from '@ngrx/store';
import { Cookbook } from '../../shared/model/model';

export const loadCookbook = createAction('[Cookbook Container] Load cookbooks');
export const loadCookbookSuccess = createAction('[Cookbook Container] Load cookbooks success', props<{ cookbooks: Cookbook[] }>());
export const loadCookbookFailure = createAction('[Cookbook Container] Load cookbooks failure');
