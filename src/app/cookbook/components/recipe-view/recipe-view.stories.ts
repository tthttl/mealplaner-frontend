import { APP_INITIALIZER } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { DialogData, Recipe } from '../../../shared/model/model';
import { RecipeViewComponent } from './recipe-view.component';

const dialogData: DialogData<Recipe> = {
  data: {
    id: '1',
    title: 'Apple Pie',
    cookbookId: 'cookbookId',
    ingredients: [
      {
        amount: 1,
        unit: 'kg',
        title: 'Apple',
        isStapleFood: false
      }
    ]
  },
  translations: [
    'Ingredients',
    'Button 1',
    'Button 2'
  ]
};

export default {
  title: 'RecipeView',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      imports: [
        MatDialogModule,
        RouterTestingModule.withRoutes([
            { path: 'recipe/:id', component: RecipeViewComponent }
            ]
        ),
        FontAwesomeModule
      ],
      declarations: [
        RecipeViewComponent,
        ButtonComponent
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: () => console.log('clicked')
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogData
        },
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

export const Default = () => ({
  component: RecipeViewComponent,
  props: {}
});

