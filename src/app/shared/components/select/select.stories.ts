import { APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { SelectComponent } from './select.component';

export default {
  title: 'Shared/Select',
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
  label: '',
  isDisabled: false,
};

export const actionsData = {
  valueChanged: action('valueChanged'),
};

// tslint:disable-next-line:no-any
const Template: any = (args: SelectComponent<string>) => ({
  component: SelectComponent,
  props: args,
});


export let Default = Template.bind({});
Default.args = {
  ...inputData,
  ...actionsData,
};

export let WithLabel = Template.bind({});
WithLabel.args = {
  ...inputData,
  ...actionsData,
  label: 'Label',
};

export let Disabled = Template.bind({});
Disabled.args = {
  ...inputData,
  ...actionsData,
  isDisabled: true,
};

export let WithObjectValues = Template.bind({});
WithObjectValues.args = {
  ...inputData,
  ...actionsData,
  options: [
    {key: 'Tesla Key', value: {brand: 'Tesla'}},
    {key: 'Audi Key', value: {brand: 'Audi'}},
    {key: 'Skoda', value: {brand: 'Skoda'}},
    {key: 'BMW', value: {brand: 'BMW'}},
  ],
};

export let WithErrors = Template.bind({});
WithErrors.args = {
  ...inputData,
  ...actionsData,
  errors: ['An error has occured!'],
};
