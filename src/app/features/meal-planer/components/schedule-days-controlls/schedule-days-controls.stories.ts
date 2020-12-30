import { APP_INITIALIZER } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { ScheduleDaysControllsComponent } from './schedule-days-controlls.component';


export default {
  title: 'MealPlaner/ScheduleDaysControls',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      imports: [FontAwesomeModule],
      declarations: [
        TranslatePipe,
        InputComponent,
        SelectComponent,
        ButtonComponent
      ],
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
          provide: TranslatePipe,
          useClass: TranslatePipe
        }
      ]
    })
  ]
};

export const actionsData = {
  changeDayIndex: action('changeDayIndex'),
};

export const daysData = {
  translations: {
    de: {
      'weekday-short.monday': 'Mo',
      'weekday-short.tuesday': 'Di',
      'weekday-short.wednesday': 'Mi',
      'weekday-short.thursday': 'Do',
      'weekday-short.friday': 'Fr',
      'weekday-short.saturday': 'Sa',
      'weekday-short.sunday': 'So',
    }
  },
  currentLanguage: 'de',
  selectedDayIndex: 0,
  currentDayIndex: 0,
};

// tslint:disable-next-line:no-any
const Template: any = (args: ScheduleDaysControllsComponent) => ({
  component: ScheduleDaysControllsComponent,
  props: args,
});

export let Default = Template.bind({});
Default.args = {
  ...daysData,
  ...actionsData,
};

export let NotCurrentDaySelected = Template.bind({});
NotCurrentDaySelected.args = {
  ...daysData,
  ...actionsData,
  selectedDayIndex: 1,
};
