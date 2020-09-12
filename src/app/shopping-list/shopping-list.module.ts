import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { I18nModule } from '../i18n/i18n.module';



@NgModule({
  declarations: [ShoppingListComponent],
  imports: [
    CommonModule,
    DragDropModule,
    MatCheckboxModule,
    I18nModule,
  ],
  exports: [
    ShoppingListComponent,
  ]
})
export class ShoppinglistModule { }
