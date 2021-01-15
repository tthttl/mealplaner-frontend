import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonLinkComponent } from './components/button-link/button-link.component';
import { ButtonComponent } from './components/button/button.component';
import { EditListDialogComponent } from './components/edit-list-dialog/edit-list-dialog.component';
import { InputComponent } from './components/input/input.component';
import { ListHeaderComponent } from './components/list-header/list-header.component';
import { ListPickerDialogComponent } from './components/list-picker-dialog/list-picker-dialog.component';
import { PasswordInputComponent } from './components/password-input/password-input.component';
import { SelectComponent } from './components/select/select.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { ToggleButtonComponent } from './components/toggle-button/toggle-button.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

const declarations = [
  ButtonComponent,
  InputComponent,
  SelectComponent,
  ListHeaderComponent,
  ListPickerDialogComponent,
  EditListDialogComponent,
  TranslatePipe,
  ButtonLinkComponent,
  PasswordInputComponent,
  ToggleButtonComponent,
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
    MatButtonToggleModule,
  ],
  exports: [
    ...declarations
  ],
})
export class SharedModule {
}
