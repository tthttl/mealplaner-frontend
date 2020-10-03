import { Action, createReducer, on } from '@ngrx/store';
import { Cookbook } from '../../shared/model/model';
import { CookbookApiActions } from '../actions';
import { CookbookState, initialCookbookState } from '../state/cookbook-state';

export const cookbookStateReducer = createReducer<CookbookState, Action>(
  initialCookbookState,
  on(CookbookApiActions.loadCookbookSuccess,
    (state: CookbookState, {cookbooks}: { cookbooks: Cookbook[] }) => ({
      ...state,
      activeCookbookId: cookbooks[0].id,
      cookbooks
    })
  )
);
