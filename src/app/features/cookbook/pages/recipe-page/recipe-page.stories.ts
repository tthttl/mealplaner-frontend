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
import { RecipePageComponent } from './recipe-page.component';


export default {
  title: 'RecipeForm',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      imports: [FontAwesomeModule, ReactiveFormsModule, MatSlideToggleModule],
      declarations: [
        RecipePageComponent,
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
  recipeSaved: action('recipeSaved')
};

export const formData = {
  translations: {
    de: {
      'recipe-form.placeholder.title': 'Title',
      'recipe-form.label.title': 'Recipe Title',
      'recipe-form.placeholder.url': 'Link',
      'recipe-form.label.url': 'Link to Recipe',
      'ingredients.label-text': 'Ingredients',
      'recipe-form.placeholder.amount': 'Quantity',
      'recipe-form.placeholder.name': 'Name',
      'recipe-form.text.toggle': 'Basic Ingredient',
      'recipe-form.button.delete': 'Delete',
      'recipe-form.button.new-ingredient': 'Add new Ingredient',
      'recipe-form.button.submit': 'Create',
      'errors.validation.title.required': 'Titel is required',
      'recipe-form.button.modify': 'Edit'
    }
  }
};

export const Default = () => ({
  component: RecipePageComponent,
  props: {
    ...formData,
    ...actionsData
  }
});

export const Edit = () => ({
  component: RecipePageComponent,
  props: {
    ...formData,
    ...actionsData,
    recipe: {
      title: 'Beef & beer pie',
      url: 'https://www.bbcgoodfood.com/recipes/beef-beer-pie',
      ingredients: [
        {
          name: 'Beer',
          amount: 1,
          unit: 'l',
          isStapleFood: true,
        },
        {
          name: 'Beef',
          amount: 1,
          unit: 'kg',
          isStapleFood: false,
        }
      ]
    }
  }
});


