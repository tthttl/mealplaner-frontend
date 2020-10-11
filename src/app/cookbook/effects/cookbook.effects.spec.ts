import { Action } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { Cookbook } from '../../shared/model/model';
import { CookbookApiActions } from '../actions';
import { CookbookService } from '../services/cookbook.service';
import { CookbookEffects } from './cookbook.effects';
import SpyObj = jasmine.SpyObj;

let cookbookService: SpyObj<CookbookService>;

describe('Cookbook Effects', () => {

  let cookbookEffects: CookbookEffects;

  it('loadCookbooks should return success action', () => {
    cookbookEffects = createEffects(CookbookApiActions.loadCookbook.type, 'loadCookbooks');
    cookbookService.loadCookbooks.and.returnValue(of([] as Cookbook[]));
    cookbookEffects.loadCookbooks.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.loadCookbookSuccess.type);
    });
  });

  it('loadCookbooks should return failure action', () => {
    cookbookEffects = createEffects(CookbookApiActions.loadCookbook.type, 'loadCookbooks');
    cookbookService.loadCookbooks.and.returnValue(throwError('error'));
    cookbookEffects.loadCookbooks.subscribe((action: Action) => {
      expect(action.type).toEqual(CookbookApiActions.loadCookbookFailure.type);
    });
  });

});


function createEffects(actionType: string, methodName: string): CookbookEffects {
  const actions$ = of({type: actionType});
  cookbookService = jasmine.createSpyObj('CookbookService', [methodName]);

  return new CookbookEffects(
    actions$,
    cookbookService
  );
}
