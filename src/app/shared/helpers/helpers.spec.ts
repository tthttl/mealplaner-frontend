import { ValidationErrors } from '@angular/forms';
import { TranslatePipe } from '../../i18n/pipes/translate.pipe';
import { I18n } from '../model/model';
import { I18n as I18nApi } from '../model/model-api';
import { mapI18nApiToI18nClient, translateValidationErrors } from './helpers';
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
    it('should return a translation per error', () => {
      const validationErrors: ValidationErrors = {
        required: 'required',
        minlength: 'min'
      };
      expect(translateValidationErrors(
        validationErrors as ValidationErrors,
        translatePipe,
        {} as I18n,
        'de',
        'key'
      )).toEqual(['dummy', 'dummy']);
    });
    it('should call transform with errors.validation.key.required', () => {
      const validationErrors: ValidationErrors = {
        required: 'required'
      };
      translateValidationErrors(
        validationErrors as ValidationErrors,
        translatePipe,
        {} as I18n,
        'de',
        'key'
      );
      expect(translatePipe.transform).toHaveBeenCalledWith('errors.validation.key.required', {}, 'de');
    });
  });
});
