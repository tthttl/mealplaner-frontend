import { APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { ScheduleComponent } from './schedule.component';
import { ScheduleControllsComponent } from '../schedule-controlls/schedule-controlls.component';
import { ScheduleDaysControllsComponent } from '../schedule-days-controlls/schedule-days-controlls.component';
import { MealType, Recipe, RecipeIngredient } from '../../../../core/models/model';


export default {
  title: 'MealPlaner/Schedule',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      imports: [FontAwesomeModule, ReactiveFormsModule, MatSlideToggleModule],
      declarations: [
        ScheduleControllsComponent,
        ScheduleDaysControllsComponent,
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
  dateChanged: action('dateChanged'),
  addMeal: action('addMeal'),
  removeMeal: action('removeMeal')
};


export const formData = {
  translations: {
    de: {
      'weekday-short.monday': 'Mo',
      'weekday-short.tuesday': 'Di',
      'weekday-short.wednesday': 'Mi',
      'weekday-short.thursday': 'Do',
      'weekday-short.friday': 'Fr',
      'weekday-short.saturday': 'Sa',
      'weekday-short.sunday': 'So',
      'meal-planer.breakfast': 'Frühstück',
      'meal-planer.lunch': 'Mittagessen',
      'meal-planer.dinner': 'Abendessen',
      'meal-planer-add.lunch': 'Mittagessen hinzufügen',
      'meal-planer-add.dinner': 'Abendessen hinzufügen',
    }
  },
  selectedDate: new Date(),
  dayPlan: {
    breakfast: [{
      id: 'id',
      type: 'breakfast',
      date: '',
      recipe: {
        title: 'Menu',
        cookbookId: 'cookbook',
        ingredients: [],
        url: 'https://google.com',
      },
    }]
  }
};

// tslint:disable-next-line:no-any
const Template: any = (args: ScheduleComponent) => ({
  component: ScheduleComponent,
  props: args,
});

export let Default = Template.bind({});
Default.args = {
  ...formData,
  ...actionsData,
};

export let Loading = Template.bind({});
Loading.args = {
  ...formData,
  ...actionsData,
  dayPlan: null
};
