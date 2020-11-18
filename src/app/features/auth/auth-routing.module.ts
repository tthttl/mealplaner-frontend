import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginContainerComponent } from './containers/login-container/login-container.component';
import { LoggedOutGuard } from '../../core/guards/logged-out.guard';
import { RegisterContainerComponent } from './containers/register-container/register-container.component';
import { ForgotPasswordContainerComponent } from './containers/forgot-password-container/forgot-password-container.component';
import { ResetPasswordContainerComponent } from './containers/reset-password-container/reset-password-container.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginContainerComponent,
    canActivate: [LoggedOutGuard]
  },
  {
    path: 'register',
    component: RegisterContainerComponent,
    canActivate: [LoggedOutGuard]
  },
  {
    path: 'forgot',
    component: ForgotPasswordContainerComponent,
    canActivate: [LoggedOutGuard]
  },
  {
    path: 'reset',
    component: ResetPasswordContainerComponent,
    canActivate: [LoggedOutGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
