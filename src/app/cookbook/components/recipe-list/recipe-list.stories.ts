import { APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { RecipeListComponent } from './recipe-list.component';


export default {
  title: 'RecipeList',
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
  inputChanged: action('inputChanged')
};

export const formData = {
  translations: {
    de: {
      'recipe-list.search': 'Suchen',
    }
  },
  recipes: [
    {
      title: 'Chocolate chip cookie'
    },
    {
      title: 'Cheesecake'
    },
    {
      title: 'Muffin'
    }
  ]
};

export const Default = () => ({
  component: RecipeListComponent,
  props: {
    ...formData,
    ...actionsData
  }
});

