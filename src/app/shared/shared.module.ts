import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonComponent } from './components/button/button.component';
import { InputComponent } from './components/input/input.component';
import { SelectComponent } from './components/select/select.component';
import { InputGroupComponent } from './components/input-group/input-group.component';


@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    SelectComponent,
    InputGroupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  exports: [
    ButtonComponent,
    InputComponent,
    SelectComponent,
    InputGroupComponent
  ]
})
export class SharedModule {
}
