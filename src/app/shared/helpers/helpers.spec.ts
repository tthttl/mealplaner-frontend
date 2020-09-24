import { FormControl } from '@angular/forms';
import { TranslatePipe } from '../../i18n/pipes/translate.pipe';
import { I18n } from '../model/model';
import { I18n as I18nApi, UserApi } from '../model/model-api';
import { decodeJwtToken, isJwtTokenExpired, mapI18nApiToI18nClient, mapUserApiToUserClient, translateValidationErrors } from './helpers';
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
      expect(translatePipe.transform).toHaveBeenCalledWith('errors.validation.required', {}, 'de');
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

  describe('mapUserApiToUserClient', () => {
    const userApi: UserApi = {
      jwt: 'jwt',
      user: {
        username: 'Joe',
        email: 'joe@doe.ch'
      },
    };
    it('should convert to User', () => {
      expect(mapUserApiToUserClient(userApi)).toEqual({
        jwt: 'jwt',
        name: 'Joe',
        email: 'joe@doe.ch'
      });
    });
  });

  describe('decodeJwt', () => {
    const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEzMTIiLCJpYXQiOjE2MDA5MzMwNTMsImV4cCI6MTYwMDkzMzE3M30.XXX';
    it('should decode', () => {
      expect(decodeJwtToken(jwtToken)).toEqual({
        id: '1312',
        iat: 1600933053,
        exp: 1600933173
      });
    });
  });

  describe('isJwtTokenExpired', () => {
    const jwtToken = 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEzMTIiLCJpYXQiOjE2MDA5MzMwNTMsImV4cCI6MTYwMDkzMzE3M30.XXX'; // Thu Sep 24 2020 09:39:33

    it('should return true when expiration date is after current date', () => {
      expect(isJwtTokenExpired(jwtToken, new Date(1600933300000 /* Thu Sep 24 2020 09:41:40  */))).toBeTrue();
    });

    it('should return false when expiration date is after current date', () => {
      expect(isJwtTokenExpired(jwtToken, new Date(1600933100000 /* Thu Sep 24 2020 09:38:20  */))).toBeFalse();
    });

    it('should return false when expiration date is not a valid Date', () => {
      const invalidJwtToken = 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEzMTIiLCJpYXQiOjE2MDA5MzMwNTMsImV4cCI6IkZDTCJ9.XXX';
      expect(isJwtTokenExpired(invalidJwtToken, new Date(1600933100000 /* Thu Sep 24 2020 09:38:20  */))).toBeFalse();
    });
  });
});
