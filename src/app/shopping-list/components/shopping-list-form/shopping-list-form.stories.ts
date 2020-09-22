import { I18n, ShoppingListItem } from '../../../shared/model/model';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { action } from '@storybook/addon-actions';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { APP_INITIALIZER } from '@angular/core';
import { ShoppingListFormComponent } from './shopping-list-form.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

export default {
  title: 'ShoppingListForm',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [TranslatePipe],
      imports: [CommonModule, ReactiveFormsModule, DragDropModule, MatCheckboxModule, FontAwesomeModule, SharedModule],
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: (iconLibrary: FaIconLibrary) => {
            return async () => {
              iconLibrary.addIconPacks(fas);
            };
          },
          deps: [ FaIconLibrary ],
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

export const actionsData = {
  itemAdded: action('itemAdded'),
};

export const taskData = {
  translations: {
    de: {
      'shoppingList.addForm.amount': 'Menge',
      'shoppingList.addForm.product': 'Zucker',
      'shoppingList.addForm.piece': 'Stück',
      'shoppingList.addForm.pack': 'Packung',
      'shoppingList.addForm.addLabel': 'Hinzufügen',
    }
  },
  currentLang: 'de'
};

export const Default = () => ({
  component: ShoppingListFormComponent,
  props: {
    ...taskData,
    ...actionsData
  },
});

