import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../../shared/shared.module';
import { LoginContainerComponent } from './containers/login-container/login-container.component';
import { RegisterContainerComponent } from './containers/register-container/register-container.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { EffectsModule } from '@ngrx/effects';
import { AuthApiEffects } from './store/effects/auth-api.effects';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { ForgotPasswordContainerComponent } from './containers/forgot-password-container/forgot-password-container.component';
import { ForgotPasswordPageComponent } from './pages/forgot-password-page/forgot-password-page.component';
import { ResetPasswordContainerComponent } from './containers/reset-password-container/reset-password-container.component';
import { ResetPasswordPageComponent } from './pages/reset-password-page/reset-password-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/regsiter-page/register-page.component';


@NgModule({
  declarations: [
    AuthFormComponent,
    RegisterPageComponent,
    LoginContainerComponent,
    RegisterContainerComponent,
    LoginPageComponent,
    ForgotPasswordContainerComponent,
    ForgotPasswordPageComponent,
    ResetPasswordContainerComponent,
    ResetPasswordPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    SharedModule,
    AuthRoutingModule,
    EffectsModule.forFeature([AuthApiEffects])
  ],
  providers: [
    {
      provide: TranslatePipe,
      useClass: TranslatePipe
    }
  ]
})
export class AuthModule {
}
