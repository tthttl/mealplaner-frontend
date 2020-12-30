import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { APP_INITIALIZER } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { I18n, ShoppingListItem } from '../../../../core/models/model';
import { ShoppingListComponent } from './shopping-list.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { buttonData } from '../../../../shared/components/button/button.stories';

export default {
  title: 'ShoppingList/ShoppingList',
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
    {id: '1', title: 'Mehl', amount: 1, unit: 'kg', shoppingList: '42'},
    {id: '2', title: 'Zucker', amount: 50, unit: 'g', shoppingList: '42'},
    {id: '3', title: 'Eier', amount: 1, unit: 'piece', shoppingList: '42'},
    {id: '4', title: 'Slaz', amount: 5, unit: 'coffeeSpoon', shoppingList: '42'},
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


// tslint:disable-next-line:no-any
const Template: any = (args: ShoppingListComponent) => ({
  component: ShoppingListComponent,
  props: args,
});

export let Default = Template.bind({});
Default.args = {
  ...taskData,
  ...actionsData,
};

export let Loading = Template.bind({});
Loading.args = {
  ...taskData,
  ...actionsData,
  items: null
};
