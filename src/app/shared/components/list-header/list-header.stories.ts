import { ListHeaderComponent } from './list-header.component';
import { moduleMetadata } from '@storybook/angular';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListPickerDialogComponent } from '../list-picker-dialog/list-picker-dialog.component';
import { APP_INITIALIZER } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';


export default {
  title: 'Shared/ListHeader',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      imports: [
        MatDialogModule,
        BrowserAnimationsModule,
        FontAwesomeModule
      ],
      entryComponents: [
        ListPickerDialogComponent
      ],
      declarations: [
        ListHeaderComponent,
        ListPickerDialogComponent
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
      ]
    })
  ]
};

// tslint:disable-next-line:no-any
const Template: any = (args: ListHeaderComponent) => ({
  component: ListHeaderComponent,
  props: args,
});


export const Default = Template.bind({});
Default.args = {
  selectedList: {id: 'test', title: 'My ShoppingList'},
  lists: [{id: 'test', title: 'My ShoppingList'}],
  defaultTitle: 'Dafault Title',
  addListLabel: 'Liste Hinufügen',
  buttonLabel: 'Meine Listen'
};

export const Loading = () => ({
  component: ListHeaderComponent,
  props: {}
});

export const OneList = () => ({
  component: ListHeaderComponent,
  props: {
    selectedList: {id: 'test', title: 'My ShoppingList'},
    lists: [{id: 'test', title: 'My ShoppingList'}],
    defaultTitle: 'Dafault Title',
    addListLabel: 'Liste Hinufügen',
    buttonLabel: 'Meine Listen'
  }
});

export const MultipleList = () => ({
  component: ListHeaderComponent,
  props: {
    selectedList: {id: 'test', title: 'My ShoppingList'},
    lists: [{id: 'test', title: 'My ShoppingList'}, {id: 'test', title: 'My ShoppingList'}, {id: 'test', title: 'My ShoppingList'}],
    defaultTitle: 'Dafault Title',
    addListLabel: 'Liste Hinufügen',
    buttonLabel: 'Meine Listen'
  }
});

export const DefaultTitle = () => ({
  component: ListHeaderComponent,
  props: {
    selectedList: {id: 'test', title: ''},
    lists: [{id: 'test', title: 'My ShoppingList'}, {id: 'test', title: 'My ShoppingList'}, {id: 'test', title: 'My ShoppingList'}],
    defaultTitle: 'Dafault Title',
    addListLabel: 'Liste Hinufügen',
    buttonLabel: 'Meine Listen'
  }
});
