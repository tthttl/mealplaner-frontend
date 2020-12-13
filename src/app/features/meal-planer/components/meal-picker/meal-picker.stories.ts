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
import { ScheduleControllsComponent } from '../schedule-controlls/schedule-controlls.component';
import { ScheduleDaysControllsComponent } from '../schedule-days-controlls/schedule-days-controlls.component';
import { MealPickerComponent } from './meal-picker.component';


export default {
  title: 'MealPlaner/MelaPicker',
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
  selectRecipe: action('selectRecipe'),
  changeSelectedCookbook: action('changeSelectedCookbook'),
};


export const formData = {
  translations: {
    de: {
      'meal-picker.title': 'Rezepet auswählen',
      'meal-picker.cookbook': 'Kochbuch',
      'meal-picker.filter': 'Suche',
      'meal-picker.empty-cookbook': 'Das Kochbuch ist leer',
      'meal-picker.empty-cookbook-add-recipe': 'Rezept hinzufügen'
    }
  },
  cookbooks: [{id: '1', title: 'Kochbuch 1'}, {id: '2', title: 'Kochbuch 2'}],
  preSelectedCookbookId: '2',
  recipes: {
    1: [
      {
        title: 'Menu 1',
        cookbookId: 'cookbook',
        ingredients: [],
        url: 'https://google.com',
      },
      {
        title: 'Menu 2',
        cookbookId: 'cookbook',
        ingredients: [],
        url: 'https://google.com',
      },
      {
        title: 'Menu 3',
        cookbookId: 'cookbook',
        ingredients: [],
        url: 'https://google.com',
      }
    ],
    2: [
      {
        title: 'Menu 1',
        cookbookId: 'cookbook',
        ingredients: [],
        url: 'https://google.com',
      },
      {
        title: 'Menu 2',
        cookbookId: 'cookbook',
        ingredients: [],
        url: 'https://google.com',
      },
      {
        title: 'Menu 3',
        cookbookId: 'cookbook',
        ingredients: [],
        url: 'https://google.com',
      }
    ]
  }
};


// tslint:disable-next-line:no-any
const Template: any = (args: MealPickerComponent) => ({
  component: MealPickerComponent,
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
  recipes: {}
};

export let EmptyList = Template.bind({});
EmptyList.args = {
  ...formData,
  ...actionsData,
  recipes: {
    1: [],
    2: []
  }
};
