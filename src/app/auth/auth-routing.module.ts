import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginContainerComponent } from './containers/login-container/login-container.component';
import { LoggedOutGuard } from '../shared/guards/logged-out.guard';
import { RegisterContainerComponent } from './containers/register-container/register-container.component';


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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
