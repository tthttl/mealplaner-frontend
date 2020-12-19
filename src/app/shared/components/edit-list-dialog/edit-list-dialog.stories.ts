import { APP_INITIALIZER } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { RouterLinkDirectiveStub } from '../../../../../testing/router-link-directive.stub';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';
import { EditListDialogComponent } from './edit-list-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'Shared/EditListDialog',
  excludeStories: /.*listData$/,
  decorators: [
    moduleMetadata({
      declarations: [EditListDialogComponent, RouterLinkDirectiveStub, InputComponent, ButtonComponent],
      imports: [FontAwesomeModule, MatDialogModule, ReactiveFormsModule, BrowserAnimationsModule],
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
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MatDialogConfig,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            data: [{id: 'id', title: 'Liste 1'}, {id: 'id', title: 'Liste 2'}],
            translations: {
              title: 'Liste',
              placeholder: 'Placeholder',
              'cancel-button-text': 'Abbrechen',
              'save-button-text': 'Speichern',
            }
          },
        },
      ]
    }),
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

export const listData = {
  linkText: 'Primary',
  buttonType: 'button',
  isDisabled: false,
  hasErrors: false,
  color: 'primary',
  e2eTestName: 'buttonTest',
  iconLeft: '',
  iconRight: '',
  clicked: action('clicked')
};

// tslint:disable-next-line:no-any
const Template: any = (args: EditListDialogComponent) => ({
  component: EditListDialogComponent,
  props: args,
  template: `<app-edit-list-dialog>Test</app-edit-list-dialog>`,
});

export let Default = Template.bind({});
Default.args = {
  ...listData,
};

Default.decorators = [
  // tslint:disable-next-line:no-any
  (storyFunc: any) => {
    const story = storyFunc();

    return {
      ...story,
      template: `
        <div class="mat-dialog-container">
            <div class="mat-dialog-content">${story.template}</div>
        </div>`,
    };
  },
];

