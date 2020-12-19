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
import { IngredientsPickerComponent } from './ingredients-picker.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Unit } from '../../../../core/models/model';


export default {
  title: 'MealPlaner/IngredientsPicker',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      imports: [FontAwesomeModule, ReactiveFormsModule, MatSlideToggleModule, MatCheckboxModule],
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
  choseIngredients: action('choseIngredients'),
  changeSelectedCookbook: action('back'),
};


export const formData = {
  translations: {
    de: {
      'unit.kg': 'kg',
      'unit.tableSpoon': 'EL',
      'ingredients-picker.back': 'zurück',
      'ingredients-picker.shopping-list': 'Einkaufsliste',
      'ingredients-picker.button': 'Hinzufügen'
    }
  },
  currentLanguage: 'de',
  shoppingLists: [{id: '1', title: 'Shoppinglist 1'}, {id: '2', title: 'Shoppinglist 1'}],
  preSelectedShoppingListId: '1',
  ingredientsList: [{
      title: 'Zutat 1',
      amount: 2,
      unit: 'kg',
      isStableFood: false,
  },
    {
      title: 'Grudzutat',
      amount: 2,
      unit: 'tableSpoon',
      isStableFood: true,
    }]
};

/*

  @Input() ingredientsList: RecipeIngredient[] | undefined = undefined;
 */

// tslint:disable-next-line:no-any
const Template: any = (args: IngredientsPickerComponent) => ({
  component: IngredientsPickerComponent,
  props: args,
});

export let Default = Template.bind({});
Default.args = {
  ...formData,
  ...actionsData,
};


