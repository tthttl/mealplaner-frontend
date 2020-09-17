import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { I18nModule } from '../i18n/i18n.module';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';


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
export class ShoppingListModule {
}
