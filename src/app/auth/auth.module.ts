import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { I18nModule } from '../i18n/i18n.module';
import { SharedModule } from '../shared/shared.module';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginContainerComponent } from './containers/login-container/login-container.component';
import { RegisterContainerComponent } from './containers/register-container/register-container.component';
import { TranslatePipe } from '../i18n/pipes/translate.pipe';
import { EffectsModule } from '@ngrx/effects';
import { AuthApiEffects } from './effects/auth-api.effects';
import { AuthRoutingModule } from './auth-routing.module';


@NgModule({
  declarations: [LoginFormComponent, LoginContainerComponent, RegisterContainerComponent],
  imports: [
    I18nModule,
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
export class AuthModule { }
