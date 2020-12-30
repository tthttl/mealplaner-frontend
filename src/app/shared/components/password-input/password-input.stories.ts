import { APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { moduleMetadata } from '@storybook/angular';
import { PasswordInputComponent } from './password-input.component';
import { InputComponent } from '../input/input.component';

export default {
  title: 'Shared/PasswordInput',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [InputComponent],
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
const Template: any = (args: PasswordInputComponent) => ({
  component: PasswordInputComponent,
  props: args,
});

export let Default = Template.bind({});
Default.args = {
  ...inputData,
};


export let WithErrors = Template.bind({});
WithErrors.args = {
  ...inputData,
  errors: ['Error']
};

