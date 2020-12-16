import { APP_INITIALIZER } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AddRecipeDialogComponent } from './add-recipe-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';

export default {
  title: 'Cookbook/RecipeView',
  decorators: [
    moduleMetadata({
      imports: [
        MatDialogModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
            { path: 'recipe/:id', component: AddRecipeDialogComponent }
            ]
        ),
        FontAwesomeModule
      ],
      declarations: [
        AddRecipeDialogComponent,
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
          useValue: {
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
            translations: {
              'ingredients.label-text': 'Ingredients',
              'button.add-to-shopping-list': 'Zur Shoppingliste hinzufügen'
            }
          }
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
  component: AddRecipeDialogComponent,
  props: {}
});

