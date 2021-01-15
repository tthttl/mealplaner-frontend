import { APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { ToggleButtonComponent } from './toggle-button.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

export default {
  title: 'Shared/ToggleButton',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [ButtonComponent],
      imports: [ReactiveFormsModule, FontAwesomeModule, MatButtonToggleModule],
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
  mobileLabelTrue: 'Ja Mobile',
  desktopLabelTrue: 'Ja Desktop',
  mobileLabelFalse: 'Nein Mobile',
  desktopLabelFalse: 'Nein Desktop',
};

export const actionsData = {
  valueChanged: action('valueChanged'),
};

// tslint:disable-next-line:no-any
const Template: any = (args: ToggleButtonComponent) => ({
  component: ToggleButtonComponent,
  props: args,
});


export let Default = Template.bind({});
Default.args = {
  ...inputData,
  ...actionsData,
};

