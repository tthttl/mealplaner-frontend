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
import { RecipeListComponent } from './recipe-list.component';
import { ShoppingListComponent } from '../../../shopping-list/components/shopping-list/shopping-list.component';
import { taskData } from '../../../shopping-list/components/shopping-list/shopping-list.stories';


export default {
  title: 'Cookbook/RecipeList',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      imports: [FontAwesomeModule, ReactiveFormsModule, MatSlideToggleModule],
      declarations: [
        RecipeListComponent,
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
  inputChanged: action('inputChanged'),
  editRecipe: action('editRecipe'),
  deleteRecipe: action('deleteRecipe')
};

export const formData = {
  translations: {
    de: {
      'input.search': 'Suchen',
      'button.edit': 'Bearbeiten',
      'button.delete': 'Löschen'
    }
  },
  recipes: [
    {
      id: '1',
      title: 'Chocolate chip cookie'
    },
    {
      id: '2',
      title: 'Cheesecake'
    },
    {
      id: '3',
      title: 'Muffin'
    }
  ]
};

// tslint:disable-next-line:no-any
const Template: any = (args: RecipeListComponent) => ({
  component: RecipeListComponent,
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
  recipes: null
};
