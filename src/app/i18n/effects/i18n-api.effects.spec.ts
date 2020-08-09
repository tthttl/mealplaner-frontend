import { Action } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { TranslationsPerLanguage } from '../../shared/model/model';
import { I18nApiActions } from '../actions';
import { I18nService } from '../services/i18n.service';
import { I18nApiEffects } from './i18n-api.effects';
import SpyObj = jasmine.SpyObj;

describe('i18n Effects', () => {
  let actions$;
  let i18nService: SpyObj<I18nService>;
  let i18nApiEffects: I18nApiEffects;

  beforeEach(() => {
    actions$ = of({type: I18nApiActions.getI18n.type});
    i18nService = jasmine.createSpyObj('i18nService', ['getI18n']);
    i18nApiEffects = new I18nApiEffects(actions$, i18nService);
  });

  it('should return success action', () => {
    i18nService.getI18n.and.returnValue(of([] as TranslationsPerLanguage[]));
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
