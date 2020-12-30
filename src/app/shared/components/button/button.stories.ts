import { APP_INITIALIZER } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from './button.component';

export default {
  title: 'Shared/Button',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      imports: [FontAwesomeModule],
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
  ],
  argTypes: {
    buttonType: {
      control: {type: 'select', options: ['button', 'submit', 'reset']},
    },
    color: {
      control: {type: 'select', options: ['primary', 'accent', 'inverted', 'warn']},
    },
    iconLeft: {
      control: {type: 'select', options: ['', 'trash', 'plus']},
    },
    iconRight: {
      control: {type: 'select', options: ['', 'trash', 'plus']},
    },
  }
};

export const actionsData = {
  clicked: action('clicked')
};

export const buttonData = {
  buttonText: 'Button',
  isDisabled: false,
  hasErrors: false,
  color: 'primary',
  e2eTestName: 'buttonTest',
  iconLeft: '',
  iconRight: '',
};

// tslint:disable-next-line:no-any
const Template: any = (args: ButtonComponent) => ({
  component: ButtonComponent,
  props: args,
});

export let Default = Template.bind({});
Default.args = {
  ...buttonData,
  ...actionsData,
};

export let Accent = Template.bind({});
Accent.args = {
  ...buttonData,
  ...actionsData,
  color: 'accent'
};

export let Warn = Template.bind({});
Warn.args = {
  ...buttonData,
  ...actionsData,
  color: 'warn'
};

export let Disabled = Template.bind({});
Disabled.args = {
  ...buttonData,
  ...actionsData,
  isDisabled: true,
};

export let IconLeft = Template.bind({});
IconLeft.args = {
  ...buttonData,
  ...actionsData,
  iconLeft: 'plus'
};

export let IconRight = Template.bind({});
IconRight.args = {
  ...buttonData,
  ...actionsData,
  iconRight: 'trash'
};


