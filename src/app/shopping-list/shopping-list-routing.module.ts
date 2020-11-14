import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import { ShoppingListContainerComponent } from './containers/shopping-list-container/shopping-list-container.component';


const routes: Routes = [
  {
    path: 'shopping-list',
    component: ShoppingListContainerComponent,
    canActivate: [AuthenticatedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingListRoutingModule { }
