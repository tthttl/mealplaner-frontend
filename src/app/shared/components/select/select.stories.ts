import { APP_INITIALIZER } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { SelectComponent } from './select.component';

export default {
  title: 'Select',
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
  options: [
    {key: 'Tesla', value: 'Tesla'},
    {key: 'Audi', value: 'Audi'},
    {key: 'Skoda', value: 'Skoda'},
    {key: 'BMW', value: 'BMW'},
  ],
  isDisabled: false,
};

export const actionsData = {
  valueChanged: action('valueChanged'),
};

export const Default = () => ({
  component: SelectComponent,
  props: {
    ...inputData,
    ...actionsData,
  }
});

export const WithLabel = () => ({
  component: SelectComponent,
  props: {
    ...inputData,
    label: 'Label',
    ...actionsData,
  }
});

export const Disabled = () => ({
  component: SelectComponent,
  props: {
    ...inputData,
    isDisabled: true,
    ...actionsData,
  }
});


export const WithObjectValues = () => ({
  component: SelectComponent,
  props: {
    ...inputData,
    options: [
      {key: 'Tesla Key', value: {brand: 'Tesla'}},
      {key: 'Audi Key', value: {brand: 'Audi'}},
      {key: 'Skoda', value: {brand: 'Skoda'}},
      {key: 'BMW', value: {brand: 'BMW'}},
    ],
    ...actionsData,
  }
});

export const WithErrors = () => ({
  component: SelectComponent,
  props: {
    ...inputData,
    errors: ['An error has occured!'],
    ...actionsData,
  }
});




function createFormControl(name: string): FormControl {
  const formGroup: FormGroup = new FormGroup({
    testControl: new FormControl('')
  });
  return formGroup.get(name) as FormControl;
}
