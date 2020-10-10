import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { I18nModule } from '../i18n/i18n.module';
import { ButtonComponent } from './components/button/button.component';
import { InputComponent } from './components/input/input.component';
import { SelectComponent } from './components/select/select.component';


@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    SelectComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatSnackBarModule,
    I18nModule,
    MatDialogModule
  ],
  exports: [
    ButtonComponent,
    InputComponent,
    SelectComponent,
  ]
})
export class SharedModule {
}
