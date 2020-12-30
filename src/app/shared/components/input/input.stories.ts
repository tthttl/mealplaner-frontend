import { APP_INITIALIZER } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from './input.component';

export default {
  title: 'Shared/Input',
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
  errors: [],
  placeholder: 'Placeholder',
};

// tslint:disable-next-line:no-any
const Template: any = (args: InputComponent) => ({
  component: InputComponent,
  props: args,
});

export let Default = Template.bind({});
Default.args = {
  ...inputData,
};

export let WithoutLabel = Template.bind({});
WithoutLabel.args = {
  ...inputData,
  label: '',
};

export let WithErros = Template.bind({});
WithoutLabel.args = {
  ...inputData,
  errors: ['Error']
};

