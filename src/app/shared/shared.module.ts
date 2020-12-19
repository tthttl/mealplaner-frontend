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
import { EditListDialogComponent } from './components/edit-list-dialog/edit-list-dialog.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { ButtonLinkComponent } from './components/button-link/button-link.component';
import { RouterModule } from '@angular/router';

const declarations = [
  ButtonComponent,
  InputComponent,
  SelectComponent,
  ListHeaderComponent,
  ListPickerDialogComponent,
  EditListDialogComponent,
  TranslatePipe,
  ButtonLinkComponent,
];


@NgModule({
  declarations,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatSnackBarModule,
    MatDialogModule,
    RouterModule,
  ],
  exports: [
    ...declarations
  ],
})
export class SharedModule {
}
