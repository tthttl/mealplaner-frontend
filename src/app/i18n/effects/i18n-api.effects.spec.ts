import { Action } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { I18n as I18nClient } from '../../shared/model/model';
import { GlobalState } from '../../shared/state';
import { I18nApiActions } from '../actions';
import { I18nService } from '../services/i18n.service';
import { I18nApiEffects } from './i18n-api.effects';
import SpyObj = jasmine.SpyObj;

describe('i18n Effects', () => {
  let actions$;
  let i18nService: SpyObj<I18nService>;
  let i18nApiEffects: I18nApiEffects;
  const initialState: GlobalState = {
    appState: {
      language: 'de',
      i18n: null,
      user: null
    }
  };
  // tslint:disable-next-line:no-any
  let store: any;

  beforeEach(() => {
    actions$ = of({type: I18nApiActions.getI18n.type});
    i18nService = jasmine.createSpyObj('i18nService', ['getI18n']);
    store = of(initialState);
    i18nApiEffects = new I18nApiEffects(
      actions$,
      i18nService,
      store);
  });

  it('should return success action', () => {
    i18nService.getI18n.and.returnValue(of({} as I18nClient));
    i18nApiEffects.getI18n.subscribe((action: Action) => {
      expect(action.type).toEqual(I18nApiActions.getI18nSuccess.type);
    });
  });
  it('should return failure action', () => {
    i18nService.getI18n.and.returnValue(throwError('error'));
    i18nApiEffects.getI18n.subscribe((action: Action) => {
      expect(action.type).toEqual(I18nApiActions.getI18nFailure.type);
    });
  });
});
