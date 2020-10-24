import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonComponent } from './components/button/button.component';
import { InputComponent } from './components/input/input.component';
import { SelectComponent } from './components/select/select.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ListPickerDialogComponent } from './components/list-picker-dialog/list-picker-dialog.component';
import { ListHeaderComponent } from './components/list-header/list-header.component';
import { CreateListDialogComponent } from './components/create-list-dialog/create-list-dialog.component';


@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    SelectComponent,
    ListHeaderComponent,
    ListPickerDialogComponent,
    CreateListDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  exports: [
    ButtonComponent,
    InputComponent,
    SelectComponent,
    ListHeaderComponent,
    ListPickerDialogComponent,
    CreateListDialogComponent,
  ],
})
export class SharedModule {
}
