import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { I18nModule } from '../i18n/i18n.module';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';



@NgModule({
  declarations: [ShoppingListComponent],
  imports: [
    CommonModule,
    DragDropModule,
    FontAwesomeModule,
    MatCheckboxModule,
    I18nModule,
  ]
})
export class ShoppinglistModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
