import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticatedGuard } from '../../core/guards/authenticated.guard';
import { MealplanerContainerComponent } from './containers/mealplaner-container/mealplaner-container.component';


const routes: Routes = [
  {
    path: '',
    component: MealplanerContainerComponent,
    canActivate: [AuthenticatedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MealPlanerRoutingModule { }
