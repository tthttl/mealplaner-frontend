import { TestBed } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { I18n as I18nClient } from '../../models/model';
import { GlobalState, initialState } from '../index';
import { I18nService } from '../../services/i18n.service';
import { AppEffects } from './app.effects';
import { I18nApiActions, NavigationActions } from '../actions';
import SpyObj = jasmine.SpyObj;

describe('i18n Api Effects', () => {
  let actions$;
  let i18nService: SpyObj<I18nService>;
  let i18nApiEffects: AppEffects;
  let store: Store<GlobalState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState}),
      ]
    });
    store = TestBed.inject(MockStore);
    i18nService = jasmine.createSpyObj('i18nService', ['getI18n']);
  });

  describe('getI18n$', () => {

    it('should return success action', () => {
      actions$ = of({type: I18nApiActions.getI18n.type});
      i18nApiEffects = new AppEffects(
        actions$,
        i18nService,
        store);
      i18nService.getI18n.and.returnValue(of({} as I18nClient));
      i18nApiEffects.getI18n$.subscribe((action: Action) => {
        expect(action.type).toEqual(I18nApiActions.getI18nSuccess.type);
      });
    });

    it('should return failure action', () => {
      actions$ = of({type: I18nApiActions.getI18n.type});
      i18nApiEffects = new AppEffects(
        actions$,
        i18nService,
        store);
      i18nService.getI18n.and.returnValue(throwError('error'));
      i18nApiEffects.getI18n$.subscribe((action: Action) => {
        expect(action.type).toEqual(I18nApiActions.getI18nFailure.type);
      });
    });

    it('should return success action when language is changed and not yet available in store', () => {
      actions$ = of({type: NavigationActions.changeLanguage.type, language: 'en'});
      i18nApiEffects = new AppEffects(
        actions$,
        i18nService,
        store);
      i18nService.getI18n.and.returnValue(of({} as I18nClient));
      i18nApiEffects.getI18n$.subscribe((action: Action) => {
        expect(action.type).toEqual(I18nApiActions.getI18nSuccess.type);
      });
    });
    it('should return failure action when language is changed and not yet available in store', () => {
      actions$ = of({type: NavigationActions.changeLanguage.type, language: 'en'});
      i18nApiEffects = new AppEffects(
        actions$,
        i18nService,
        store);
      i18nService.getI18n.and.returnValue(throwError('error'));
      i18nApiEffects.getI18n$.subscribe((action: Action) => {
        expect(action.type).toEqual(I18nApiActions.getI18nFailure.type);
      });
    });
  });


  describe('setUserLanguageToLocaleStore$', () => {
    it('should set language to local storage if language changed', () => {
      spyOn(localStorage, 'setItem');
      actions$ = of({type: NavigationActions.changeLanguage.type, language: 'en'});
      i18nApiEffects = new AppEffects(
        actions$,
        i18nService,
        store);
      i18nService.getI18n.and.returnValue(throwError('error'));
      i18nApiEffects.setUserLanguageToLocaleStore$.subscribe((action: Action) => {
        expect(localStorage.setItem).toHaveBeenCalledWith('userLanguage', 'en');
      });
    });
  });
});
