import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { APP_INITIALIZER } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { I18n, ShoppingListItem } from '../../../shared/model/model';
import { ShoppingListComponent } from './shopping-list.component';

export default {
  title: 'ShoppingList',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [TranslatePipe],
      imports: [CommonModule,  DragDropModule, MatCheckboxModule, FontAwesomeModule],
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
      ]
    }),
  ],
};

export const actionsData = {
  itemDeleted: action('itemDeleted'),
  listItemMoved: action('listItemMoved'),
};

export const taskData: {items: ShoppingListItem[], translations: I18n} = {
  items: [
    {id: '1', title: 'Mehl', amount: 1, unit: 'kg', isChecked: false, shoppingList: '42'},
    {id: '2', title: 'Zucker', amount: 50, unit: 'g', isChecked: false, shoppingList: '42'},
    {id: '3', title: 'Eier', amount: 1, unit: 'piece', isChecked: false, shoppingList: '42'},
    {id: '4', title: 'Slaz', amount: 5, unit: 'coffeeSpoon', isChecked: false, shoppingList: '42'},
  ],
  translations: {
    de: {
      piece: '',
      tableSpoon: 'Esslöffel',
      coffeeSpoon: 'Kaffelöffel',
      pinch: 'Prise',
    }
  }
};

export const Default = () => ({
  component: ShoppingListComponent,
  props: {
    ...taskData,
    ...actionsData
  },
});

