import { TestBed } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { I18n as I18nClient } from '../../shared/model/model';
import { GlobalState, initialState } from '../../shared/state';
import { I18nApiActions, I18nContainerActions } from '../actions';
import { I18nService } from '../services/i18n.service';
import { I18nApiEffects } from './i18n-api.effects';
import SpyObj = jasmine.SpyObj;

describe('i18n Api Effects', () => {
  let actions$;
  let i18nService: SpyObj<I18nService>;
  let i18nApiEffects: I18nApiEffects;
  let store: Store<GlobalState>;

  describe('getI18n', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideMockStore({initialState}),
        ]
      });
      store = TestBed.inject(MockStore);
      actions$ = of({type: I18nApiActions.getI18n.type});
      i18nService = jasmine.createSpyObj('i18nService', ['getI18n']);
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

    it('should return success action when language is changed and not yet available in store', () => {
      actions$ = of({type: I18nContainerActions.changeLanguage.type, language: 'en'});
      i18nApiEffects = new I18nApiEffects(
        actions$,
        i18nService,
        store);
      i18nService.getI18n.and.returnValue(of({} as I18nClient));
      i18nApiEffects.getI18n.subscribe((action: Action) => {
        expect(action.type).toEqual(I18nApiActions.getI18nSuccess.type);
      });
    });
    it('should return failure action when language is changed and not yet available in store', () => {
      actions$ = of({type: I18nContainerActions.changeLanguage.type, language: 'en'});
      i18nApiEffects = new I18nApiEffects(
        actions$,
        i18nService,
        store);
      i18nService.getI18n.and.returnValue(throwError('error'));
      i18nApiEffects.getI18n.subscribe((action: Action) => {
        expect(action.type).toEqual(I18nApiActions.getI18nFailure.type);
      });
    });
  });
});
