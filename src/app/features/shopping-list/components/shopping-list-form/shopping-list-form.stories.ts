import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { action } from '@storybook/addon-actions';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { APP_INITIALIZER } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ShoppingListFormComponent } from './shopping-list-form.component';

export default {
  title: 'ShoppingList/ShoppingListForm',
  excludeStories: /.*formData$/,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, ReactiveFormsModule, DragDropModule, MatCheckboxModule, FontAwesomeModule, SharedModule],
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
    }),
  ],
};


export const formData = {
  translations: {
    de: {
      'shoppingList.addForm.amount': 'Menge',
      'shoppingList.addForm.product': 'Zucker',
      'shoppingList.addForm.piece': 'Stück',
      'shoppingList.addForm.pack': 'Packung',
      'shoppingList.addForm.addLabel': 'Hinzufügen',
    }
  },
  currentLang: 'de',
  itemAdded: action('itemAdded'),
};


// tslint:disable-next-line:no-any
const Template: any = (args: ShoppingListFormComponent) => ({
  component: ShoppingListFormComponent,
  props: args,
});

export let Default = Template.bind({});
Default.args = {
  ...formData,
};
