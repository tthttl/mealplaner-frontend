import { APP_INITIALIZER } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from './button.component';

export default {
  title: 'Button',
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
  ]
};

export const actionsData = {
  clicked: action('clicked')
};

export const buttonData = {
  text: 'Primary',
  isDisabled: false,
  e2eTestName: 'buttonTest'
};

export const Default = () => ({
  component: ButtonComponent,
  props: {
    buttonText: buttonData.text,
    isDisabled: buttonData.isDisabled,
    e2eTestName: buttonData.e2eTestName,
    clicked: actionsData.clicked
  }
});

export const Accent = () => ({
  component: ButtonComponent,
  props: {
    buttonText: 'Accent',
    isDisabled: buttonData.isDisabled,
    e2eTestName: buttonData.e2eTestName,
    clicked: actionsData.clicked,
    color: 'accent'
  }
});

export const Warning = () => ({
  component: ButtonComponent,
  props: {
    buttonText: 'Warning',
    isDisabled: buttonData.isDisabled,
    e2eTestName: buttonData.e2eTestName,
    clicked: actionsData.clicked,
    color: 'warn'
  }
});

export const Disabled = () => ({
  component: ButtonComponent,
  props: {
    buttonText: 'Disabled',
    isDisabled: true,
    e2eTestName: buttonData.e2eTestName,
    clicked: actionsData.clicked,
  }
});

export const IconLeft = () => ({
  component: ButtonComponent,
  props: {
    buttonText: 'Add',
    isDisabled: buttonData.isDisabled,
    e2eTestName: buttonData.e2eTestName,
    clicked: actionsData.clicked,
    iconLeft: 'plus'
  }
});

export const IconRight = () => ({
  component: ButtonComponent,
  props: {
    buttonText: 'Delete',
    isDisabled: buttonData.isDisabled,
    e2eTestName: buttonData.e2eTestName,
    clicked: actionsData.clicked,
    iconRight: 'trash'
  }
});
