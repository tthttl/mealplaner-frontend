import { AbstractControl } from '@angular/forms';
import * as CustomValidators from './custom-validators.validator';

describe('Validators', () => {
  describe('EmailValidator', () => {
    const validationError: {email: true} = {email: true};

    it('should return null for valid e-mail address', () => {
      expect(CustomValidators.email({value: 'this@that.com'} as AbstractControl)).toBeNull();
    });

    it('should return null for valid e-mail address with two points after the at sign', () => {
      expect(CustomValidators.email({value: 'this@that.ch.com'} as AbstractControl)).toBeNull();
    });

    it('should return an error for empty string', () => {
      expect(CustomValidators.email({value: ''} as AbstractControl)).toEqual(validationError);
    });

    it('should return an error if the @ sign is missing', () => {
      expect(CustomValidators.email({value: 'thisthat.com'} as AbstractControl)).toEqual(validationError);
    });

    it('should return an error if the @ sign occurs twice', () => {
      expect(CustomValidators.email({value: 'this@@that.com'} as AbstractControl)).toEqual(validationError);
    });

    it('should return an error if the top level domain is missing', () => {
      expect(CustomValidators.email({value: 'thisthat@that'} as AbstractControl)).toEqual(validationError);
    });
  });
});
