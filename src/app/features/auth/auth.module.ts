import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { SharedModule } from '../../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { AccountContainerComponent } from './containers/account-container/account-container.component';
import { ForgotPasswordContainerComponent } from './containers/forgot-password-container/forgot-password-container.component';
import { LoginContainerComponent } from './containers/login-container/login-container.component';
import { RegisterContainerComponent } from './containers/register-container/register-container.component';
import { ResetPasswordContainerComponent } from './containers/reset-password-container/reset-password-container.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { DeleteAccountConfirmationDialogPageComponent } from './pages/delete-account-confirmation-dialog-page/delete-account-confirmation-dialog-page.component';
import { ForgotPasswordPageComponent } from './pages/forgot-password-page/forgot-password-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ResetPasswordPageComponent } from './pages/reset-password-page/reset-password-page.component';
import { AuthApiEffects } from './store/effects/auth-api.effects';


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
    ResetPasswordPageComponent,
    AccountContainerComponent,
    AccountPageComponent,
    DeleteAccountConfirmationDialogPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    SharedModule,
    AuthRoutingModule,
    EffectsModule.forFeature([AuthApiEffects]),
    FormsModule
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
