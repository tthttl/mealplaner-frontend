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
      declarations: [ButtonComponent, InputComponent],
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
  testName: 'test',
  label: 'Label',
  errors: ['Ooops!', 'An error has occured!'],
  placeholder: 'Placeholder',
  formControl: createFormControl()
};

export const actionsData = {
  clicked: action('clicked'),
  inputChanged: action('inputChanged'),
  fieldLeft: action('fieldLeft')
};

export const Default = () => ({
  component: InputComponent,
  props: {
    ...inputData,
    placeholder: '',
    errors: [],
    inputChanged: actionsData.inputChanged,
    fieldLeft: actionsData.fieldLeft
  }
});

export const WithoutLabel = () => ({
  component: InputComponent,
  props: {
    ...inputData,
    label: '',
    errors: [],
    inputChanged: actionsData.inputChanged,
    fieldLeft: actionsData.fieldLeft
  }
});

export const WithError = () => ({
  component: InputComponent,
  props: {
    ...inputData,
    placeholder: '',
    inputChanged: actionsData.inputChanged,
    fieldLeft: actionsData.fieldLeft
  }
});

export const WithPrimaryButton = () => ({
  component: InputComponent,
  props: {
    ...inputData,
    placeholder: '',
    buttonText: 'Click',
    errors: [],
    clicked: actionsData.clicked,
    inputChanged: actionsData.inputChanged,
    fieldLeft: actionsData.fieldLeft
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
    clicked: actionsData.clicked,
    inputChanged: actionsData.inputChanged,
    fieldLeft: actionsData.fieldLeft
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
    clicked: actionsData.clicked,
    inputChanged: actionsData.inputChanged,
    fieldLeft: actionsData.fieldLeft
  }
});

function createFormControl(): FormControl {
  const formGroup: FormGroup = new FormGroup({
    testControl: new FormControl('')
  });
  return formGroup.get('testControl') as FormControl;
}
