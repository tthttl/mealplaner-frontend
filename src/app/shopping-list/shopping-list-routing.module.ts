import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShoppingListContainerComponent } from './containers/shopping-list-container/shopping-list-container.component';
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';


const routes: Routes = [
  {
    path: '',
    component: ShoppingListContainerComponent,
    canActivate: [AuthenticatedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingListRoutingModule { }
