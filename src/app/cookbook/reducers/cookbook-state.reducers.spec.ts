import { Cookbook } from '../../shared/model/model';
import { CookbookApiActions } from '../actions';
import { initialCookbookState } from '../state/cookbook-state';
import { cookbookStateReducer } from './cookbook-state.reducers';

describe('CookbookState Reducer', () => {

  const cookbook: Partial<Cookbook> = {
    id: '1',
    title: 'cookbook'
  };

  const cookbooks: Cookbook[] = [cookbook as Cookbook];

  it(`${CookbookApiActions.loadCookbookSuccess}`, () => {
    expect(cookbookStateReducer(
      {...initialCookbookState},
      CookbookApiActions.loadCookbookSuccess({cookbooks})
    )).toEqual({
      ...initialCookbookState,
      activeCookbookId: cookbooks[0].id,
      cookbooks
    });
  });
});
