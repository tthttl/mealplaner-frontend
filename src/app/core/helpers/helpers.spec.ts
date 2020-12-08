import { FormControl, FormGroup } from '@angular/forms';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { I18n, Recipe } from '../models/model';
import { I18n as I18nApi, UserApi } from '../models/model-api';
import {
  addItemAlphabetically,
  copyOrCreateArray,
  decodeJwtToken,
  isFormTouchedOrDirty,
  getWeekDayIndex,
  getFirstDateOfWeek,
  isJwtTokenExpired,
  mapI18nApiToI18nClient,
  mapUserApiToUserClient,
  moveItemInArray,
  translateValidationErrors
} from './helpers';
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
      )).toEqual([]);
    });
  });

  describe('mapUserApiToUserClient', () => {
    const userApi: UserApi = {
      jwt: 'jwt',
      user: {
        _id: '0',
        username: 'Joe',
        email: 'joe@doe.ch'
      },
    };
    it('should convert to User', () => {
      expect(mapUserApiToUserClient(userApi)).toEqual({
        id: '0',
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

  describe('moveItemInArray', () => {
    it('should move item to end of the array', () => {
      expect(moveItemInArray([0, 1, 2, 3, 4], 0, 4)).toEqual([1, 2, 3, 4, 0]);
    });
    it('should move item to start of the array', () => {
      expect(moveItemInArray([0, 1, 2, 3, 4], 4, 0)).toEqual([4, 0, 1, 2, 3]);
    });
    it('should move item to forward within the the array', () => {
      expect(moveItemInArray([0, 1, 2, 3, 4], 1, 3)).toEqual([0, 2, 3, 1, 4]);
    });
    it('should move item to backwords within the the array', () => {
      expect(moveItemInArray([0, 1, 2, 3, 4], 3, 1)).toEqual([0, 3, 1, 2, 4]);
    });
  });

  describe('addItemAlphabetically', () => {
    const recipeA: Partial<Recipe> = {
      id: '1',
      title: 'Recipe A'
    };

    const recipeB: Partial<Recipe> = {
      id: '2',
      title: 'Recipe B'
    };

    const recipeC: Partial<Recipe> = {
      id: '3',
      title: 'Recipe C'
    };

    it('should add first', () => {
      const recipes: Recipe[] = [recipeB as Recipe, recipeC as Recipe];
      expect(addItemAlphabetically(recipeA as Recipe, recipes)).toEqual([recipeA as Recipe, recipeB as Recipe, recipeC as Recipe]);
    });

    it('should add last', () => {
      const recipes: Recipe[] = [recipeA as Recipe, recipeB as Recipe];
      expect(addItemAlphabetically(recipeC as Recipe, recipes)).toEqual([recipeA as Recipe, recipeB as Recipe, recipeC as Recipe]);
    });

    it('should add in the middle', () => {
      const recipes: Recipe[] = [recipeA as Recipe, recipeC as Recipe];
      expect(addItemAlphabetically(recipeB as Recipe, recipes)).toEqual([recipeA as Recipe, recipeB as Recipe, recipeC as Recipe]);
    });
  });

  describe('copyOrCreateArray', () => {
    it('should copy array', () => {
      expect(copyOrCreateArray({1: [{id: 1}, {id: 2}]}, '1'))
        .toEqual([{id: 1}, {id: 2}]);
    });
    it('should create empty array', () => {
      expect(copyOrCreateArray({1: [{id: 1}, {id: 2}]}, '2'))
        .toEqual([]);
    });
  });

  describe('isFormChanged', () => {
    it('should return false when form is not touched or dirty', () => {
      expect(isFormTouchedOrDirty(new FormGroup({}))).toBeFalsy();
    });
    it('should return true when form is touched', () => {
      const formGroup = new FormGroup({});
      formGroup.markAllAsTouched();
      expect(isFormTouchedOrDirty(formGroup)).toBeTruthy();
    });
    it('should return true when form is dirt', () => {
      const formGroup = new FormGroup({});
      formGroup.markAsDirty();
      expect(isFormTouchedOrDirty(formGroup)).toBeTruthy();
    });
  });

  describe(`getFirstDateOfWeek`, () => {
    it('should return First Day of Week', () => {
      expect(getFirstDateOfWeek(new Date(2020, 10, 28))).toEqual(new Date(2020, 10, 23));
    });
  });

  describe(`getDayIndex`, () => {
    it('should return Day Index', () => {
      expect(getWeekDayIndex(new Date(2020, 10, 28))).toEqual(5);
    });
  });
});


