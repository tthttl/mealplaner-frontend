import { ShoppingListComponent } from './shopping-list.component';
import { I18n, ShoppingListItem } from '../../../shared/model/model';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { action } from '@storybook/addon-actions';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';

export default {
  title: 'ShoppingList',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [TranslatePipe],
      imports: [CommonModule,  DragDropModule, MatCheckboxModule],
    }),
  ],
};

export const actionsData = {
  itemDeleted: action('itemDeleted'),
  listItemMoved: action('listItemMoved'),
};

export const taskData: {items: ShoppingListItem[], translations: I18n} = {
  items: [
    {id: '1', name: 'Mehl', amount: 1, unit: 'kg', isChecked: false},
    {id: '2', name: 'Zucker', amount: 50, unit: 'g', isChecked: false},
    {id: '3', name: 'Eier', amount: 1, unit: 'piece', isChecked: false},
    {id: '4', name: 'Slaz', amount: 5, unit: 'coffeeSpoon', isChecked: false},
  ],
  translations: {
    de: {
      piece: 'Stücke',
      tableSpoon: 'Esslöffel',
      coffeeSpoon: 'Kaffelöffel',
      pinch: 'Prise',
    }
  }
};

export const Default = () => ({
  component: ShoppingListComponent,
  props: {
    items: taskData.items,
    translations: taskData.translations,
    itemDeleted: actionsData.itemDeleted,
    listItemMoved: actionsData.listItemMoved,
  },
});

