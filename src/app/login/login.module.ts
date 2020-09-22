import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { I18nModule } from '../i18n/i18n.module';
import { SharedModule } from '../shared/shared.module';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginContainerComponent } from './containers/login-container/login-container.component';
import { RegisterContainerComponent } from './containers/register-container/register-container.component';
import { LoginRoutingModule } from './login-routing.module';
import { TranslatePipe } from '../i18n/pipes/translate.pipe';


@NgModule({
  declarations: [LoginFormComponent, LoginContainerComponent, RegisterContainerComponent],
  imports: [
    I18nModule,
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    SharedModule,
    LoginRoutingModule
  ],
  providers: [
    {
      provide: TranslatePipe,
      useClass: TranslatePipe
    }
  ]
})
export class LoginModule { }
