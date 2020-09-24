import { FormControl } from '@angular/forms';
import { TranslatePipe } from '../../i18n/pipes/translate.pipe';
import { I18n } from '../model/model';
import { I18n as I18nApi } from '../model/model-api';
import { changeElementPosition, mapI18nApiToI18nClient, translateValidationErrors } from './helpers';
import createSpyObj = jasmine.createSpyObj;

describe('Helpers', () => {
  describe('mapI18nApiToI18nClient', () => {
    const i18nApi: I18nApi = {
      lang: 'de',
      translations: {
        test: 'Test'
      }
    };
    it('should convert I18nApi', () => {
      expect(mapI18nApiToI18nClient(i18nApi)).toEqual({
        de: {
          test: 'Test'
        }
      });
    });
  });

  describe('translateValidationErrors', () => {
    const translatePipe = createSpyObj('TranslatePipe', ['transform']);
    translatePipe.transform.and.returnValue('dummy');
    let formControl: Partial<FormControl>;
    beforeEach(() => {
      formControl = {
        get invalid(): boolean {
          return true;
        },
        touched: true,
        errors: {
          required: 'required',
          minlength: 'min'
        }
      };
    });
    it('should return a translation per error', () => {
      expect(translateValidationErrors(
        formControl as FormControl,
        translatePipe,
        {} as I18n,
        'de',
        'key'
      )).toEqual(['dummy', 'dummy']);
    });
    it('should call transform with errors.validation.key.required', () => {
      formControl = {
        ...formControl,
        errors: {
          required: 'required'
        }
      };
      translateValidationErrors(
        formControl as FormControl,
        translatePipe,
        {} as I18n,
        'de',
        'key'
      );
      expect(translatePipe.transform).toHaveBeenCalledWith('errors.validation.key.required', {}, 'de');
    });

    it('should not have errors when its not touched or dirty', () => {
      formControl = {
        ...formControl,
        touched: false,
        errors: {
          required: 'required'
        }
      };
      expect(translateValidationErrors(
        formControl as FormControl,
        translatePipe,
        {} as I18n,
        'de',
        'key'
      )).toEqual([]);
    });

    it('should not have errors when there are no errors', () => {
      formControl = {
        ...formControl,
        touched: true,
        get dirty(): boolean {
          return true;
        },
        errors: null
      };
      expect(translateValidationErrors(
        formControl as FormControl,
        translatePipe,
        {} as I18n,
        'de',
        'key'
      )).toEqual([]);
    });
  });

  describe('changeElementPosition', () => {
    let input: number[] = [];
    beforeEach(() => {
      input = [1, 2, 3, 4];
    });
    it('should change pos from 3 to 0', () => {
      expect(changeElementPosition(input, {previousIndex: 3, currentIndex: 0}))
        .toEqual([4, 1, 2, 3]);
    });
    it('should change pos from 0 to 3', () => {
      expect(changeElementPosition(input, {previousIndex: 3, currentIndex: 0}))
        .toEqual([2, 3, 4, 1]);
    });
    it('should change pos from 2 to 2', () => {
      expect(changeElementPosition(input, {previousIndex: 3, currentIndex: 0}))
        .toEqual([1, 2, 3, 4]);
    });
  });
});
