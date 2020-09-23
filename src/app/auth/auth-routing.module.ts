import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginContainerComponent } from './containers/login-container/login-container.component';
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import { LoggedOutGuard } from '../shared/guards/logged-out.guard';


const routes: Routes = [
  {
    path: 'login',
    component: LoginContainerComponent,
    canActivate: [LoggedOutGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
