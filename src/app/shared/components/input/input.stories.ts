import { APP_INITIALIZER } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from './input.component';

export default {
  title: 'Input',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [ButtonComponent],
      imports: [ReactiveFormsModule, FontAwesomeModule],
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: (iconLibrary: FaIconLibrary) => {
            return async () => {
              iconLibrary.addIconPacks(fas);
            };
          },
          deps: [FaIconLibrary],
          multi: true,
        },
      ]
    })
  ]
};

export const inputData = {
  isDisabled: false,
  e2eTestName: 'test',
  label: 'Label',
  errors: ['Ooops!', 'An error has occured!'],
  placeholder: 'Placeholder',
  formControl: createFormControl()
};

export const actionsData = {
  clicked: action('clicked'),
};

export const Default = () => ({
  component: InputComponent,
  props: {
    ...inputData,
    placeholder: '',
    errors: []
  }
});

export const WithoutLabel = () => ({
  component: InputComponent,
  props: {
    ...inputData,
    label: '',
    errors: []
  }
});

export const WithError = () => ({
  component: InputComponent,
  props: {
    ...inputData,
    placeholder: ''
  }
});

export const WithPrimaryButton = () => ({
  component: InputComponent,
  props: {
    ...inputData,
    placeholder: '',
    buttonText: 'Click',
    errors: [],
    clicked: actionsData.clicked
  }
});

export const WithAccentButton = () => ({
  component: InputComponent,
  props: {
    ...inputData,
    placeholder: '',
    buttonText: 'Click',
    errors: [],
    color: 'accent',
    clicked: actionsData.clicked
  }
});

export const WithButtonAndError = () => ({
  component: InputComponent,
  props: {
    ...inputData,
    placeholder: '',
    buttonText: 'Click',
    errors: ['Ooops!', 'An error has occured!'],
    color: 'accent',
    clicked: actionsData.clicked
  }
});

function createFormControl(): FormControl {
  const formGroup: FormGroup = new FormGroup({
    testControl: new FormControl('')
  });
  return formGroup.get('testControl') as FormControl;
}
